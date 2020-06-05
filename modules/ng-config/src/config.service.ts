/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { EventEmitter, Inject, Injectable, Injector, Optional } from '@angular/core';

import { Observable, forkJoin } from 'rxjs';
import { map, share, take, tap } from 'rxjs/operators';

import { CONFIG_PROVIDER, ConfigProvider } from './config-provider';
import { CONFIG_OPTIONS, ConfigOptions } from './config-options';
import { ConfigSection, ConfigValue } from './config-value';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function mapOptionValues(options: ConfigSection, configSection: ConfigSection): void {
    const keys = Object.keys(options);
    for (const key of keys) {
        if (!Object.prototype.hasOwnProperty.call(configSection, key)) {
            continue;
        }

        // const popDescriptor = Object.getOwnPropertyDescriptor(options, key);
        // if (!popDescriptor?.writable) {
        //     continue;
        // }

        const optionsValue = options[key];
        const configValue = configSection[key];

        if (configValue == null) {
            options[key] = null;
            continue;
        }

        if (optionsValue == null) {
            options[key] = configValue;
            continue;
        }

        if (optionsValue === configValue) {
            continue;
        }

        if (typeof optionsValue === 'string') {
            if (typeof configValue === 'string') {
                options[key] = configValue;
            } else {
                options[key] = JSON.stringify(configValue);
            }
        } else if (typeof optionsValue === 'boolean') {
            if (typeof configValue === 'boolean') {
                options[key] = configValue;
            } else if (typeof configValue === 'string') {
                options[key] = ['true', '1', 'on', 'yes'].indexOf(configValue.toLowerCase()) > -1;
            } else if (typeof configValue === 'number') {
                options[key] = configValue === 1;
            } else {
                options[key] = false;
            }
        } else if (typeof optionsValue === 'number') {
            options[key] = Number(configValue) || 0;
        } else if (Array.isArray(optionsValue)) {
            if (Array.isArray(configValue)) {
                if (
                    configValue.length > 0 &&
                    configValue.filter((v) => typeof v == 'string').length === configValue.length
                ) {
                    options[key] = [...configValue];
                } else {
                    options[key] = [];
                }
            } else if (typeof configValue === 'string') {
                options[key] = configValue
                    .split(';')
                    .map((s) => s.trim())
                    .filter((s) => s.length > 0);
            }
        } else if (
            typeof optionsValue === 'object' &&
            Object.prototype.toString.call(optionsValue) !== '[object Date]'
        ) {
            if (!Array.isArray(configValue) && typeof configValue === 'object') {
                mapOptionValues(optionsValue, configValue);
            }
        }
    }
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function equalDeep(a: ConfigValue, b: ConfigValue): boolean {
    if (a === null && b === null) {
        return true;
    }

    if (Array.isArray(a)) {
        if (!b || !Array.isArray(b)) {
            return false;
        }

        if (a.length !== b.length) {
            return false;
        }

        for (let i = a.length - 1; i >= 0; i--) {
            if (!equalDeep(a[i], b[i])) {
                return false;
            }
        }

        return true;
    }

    if (Array.isArray(b)) {
        return false;
    }

    if (a && b && typeof a == 'object' && typeof b == 'object') {
        const keys = Object.keys(a);
        if (keys.length !== Object.keys(b).length) {
            return false;
        }

        for (const key of keys) {
            if (!equalDeep(a[key], b[key])) {
                return false;
            }
        }

        return true;
    }

    return a === b;
}

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    readonly valueChanges: Observable<ConfigSection>;

    private readonly optionsSuffix: string;
    private readonly options: ConfigOptions;
    private readonly fetchRequests: { [key: string]: Observable<ConfigSection> } = {};

    private loading = false;
    private completed = false;

    private currentConfig$ = new Observable<ConfigSection>();
    private loadedConfig: ConfigSection = {};
    private optionsRecord = new Map<string, unknown>();

    get providers(): ConfigProvider[] {
        return this.sortedConfigProviders;
    }

    private readonly sortedConfigProviders: ConfigProvider[];

    constructor(
        @Inject(CONFIG_PROVIDER) configProviders: ConfigProvider[],
        private readonly injector: Injector,
        @Optional() @Inject(CONFIG_OPTIONS) options?: ConfigOptions
    ) {
        this.sortedConfigProviders = configProviders.reverse();
        this.options = options || {};
        this.optionsSuffix = this.options.optionsSuffix || 'Options';
        this.valueChanges = new EventEmitter<ConfigSection>();
    }

    load(reload?: boolean): Observable<ConfigSection> {
        if (this.completed && !reload) {
            this.log('Configuration already loaded.');

            return this.currentConfig$;
        }

        if (!this.loading) {
            this.log('Cconfiguration loading started.');

            this.loading = true;
            this.completed = false;
        }

        this.currentConfig$ = forkJoin(
            this.providers.map((configProvider) => {
                const providerName = configProvider.name;

                if (reload || !this.fetchRequests[providerName]) {
                    const loadObs = configProvider.load().pipe(
                        tap((config) => {
                            this.log(providerName, config);
                        }),
                        share()
                    );

                    this.fetchRequests[providerName] = loadObs.pipe(take(1), share());
                }

                return this.fetchRequests[providerName];
            })
        ).pipe(
            map((configs) => {
                let mergedConfig: ConfigSection = {};

                configs.forEach((config) => {
                    mergedConfig = { ...mergedConfig, ...config };
                });

                return mergedConfig;
            })
        );

        this.currentConfig$.subscribe(
            (config) => {
                this.loading = false;

                if (!equalDeep(config, this.loadedConfig)) {
                    this.optionsRecord.clear();
                    this.loadedConfig = config;
                    (this.valueChanges as EventEmitter<ConfigSection>).emit(config);
                }

                this.completed = true;
                this.log('Configuration loading completed.');
            },
            () => {
                this.loading = false;
                this.completed = false;
            }
        );

        return this.currentConfig$;
    }

    getValue(key: string): ConfigValue {
        return this.getConfigValue(key, this.loadedConfig);
    }

    map<T>(optionsClass: new () => T): T {
        const optionsObj = this.injector.get<T>(optionsClass, new optionsClass());
        const normalizedKey = this.getNormalizedKey(optionsClass.name);
        const cachedOptions = this.optionsRecord.get(normalizedKey) as T;
        if (cachedOptions != null) {
            if (cachedOptions === optionsObj) {
                return cachedOptions;
            }

            this.optionsRecord.delete(normalizedKey);
        }

        const configValue = this.getValue(normalizedKey);

        if (configValue == null || Array.isArray(configValue) || typeof configValue !== 'object') {
            return optionsObj;
        }

        mapOptionValues(optionsObj as never, configValue);
        this.optionsRecord.set(normalizedKey, optionsObj);

        return optionsObj;
    }

    private getConfigValue(key: string, config: ConfigSection): ConfigValue {
        const keyArray = key.split(/:/);
        const result = keyArray.reduce((acc, current: string) => acc && acc[current], config);
        if (result === undefined) {
            return null;
        }

        return result;
    }

    private getNormalizedKey(className: string): string {
        let normalizedKey = className;
        if (normalizedKey.length > this.optionsSuffix.length && normalizedKey.endsWith(this.optionsSuffix)) {
            normalizedKey = normalizedKey.substr(0, normalizedKey.length - this.optionsSuffix.length);
        }

        normalizedKey = normalizedKey[0].toLowerCase() + normalizedKey.substr(1);

        return normalizedKey;
    }

    private log(msg: string, data?: unknown): void {
        if (!this.options.debug) {
            return;
        }

        if (data) {
            if (this.options.logger) {
                this.options.logger.debug(`[ConfigService] ${msg}, data: `, data);
            } else {
                // eslint-disable-next-line no-console
                console.log(`[ConfigService] ${msg}, data: `, data);
            }
        } else {
            if (this.options.logger) {
                this.options.logger.debug(`[ConfigService] ${msg}`);
            } else {
                // eslint-disable-next-line no-console
                console.log(`[ConfigService] ${msg}`);
            }
        }
    }
}
