/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { map, share, take, tap } from 'rxjs/operators';

import { ConfigLoader } from './config-loader';
import { CONFIG_LOADER } from './config-loader-token';

export interface ConfigLoadingContext {
    data: { [key: string]: unknown };
    status?: 'loading' | 'loaded';
}

/**
 * Options for `ConfigService`.
 */
export interface ConfigOptions {
    /**
     * Set true to log debug information.
     */
    trace?: boolean;
}

export const CONFIG_OPTIONS = new InjectionToken<ConfigOptions>('ConfigOptions');

/**
 * The core service for loading configuration from loaders and getting setting value from cached settings.
 */
@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    readonly loadEvent: Observable<ConfigLoadingContext>;

    private readonly options: ConfigOptions;
    private readonly onLoad = new BehaviorSubject<ConfigLoadingContext>({ data: {} });
    private readonly fetchRequests: { [key: string]: Observable<{ [key: string]: unknown }> } = {};

    private cachedSettings: { [key: string]: unknown } = {};
    private loading = false;
    private completed = false;

    /**
     * The property to get the loader names.
     */
    get loaderNames(): string[] {
        if (!this.configLoaders || !this.configLoaders.length) {
            return [];
        }

        return this.configLoaders.map((configLoader) => configLoader.name);
    }

    constructor(
        @Optional() @Inject(CONFIG_LOADER) private readonly configLoaders?: ConfigLoader[],
        @Optional() @Inject(CONFIG_OPTIONS) options?: ConfigOptions
    ) {
        this.options = options || {};
        this.loadEvent = this.onLoad.asObservable();
    }

    /**
     * The method to load and cache config data.
     * @param reLoad Flag to force reload the configuration.
     * @returns Returns the observable of loaded config data.
     * @throws {Error} Throws error if no 'CONFIG_LOADER' provided.
     */
    load(reLoad?: boolean): Observable<{ [key: string]: unknown }> {
        if (!this.configLoaders || !this.configLoaders.length) {
            throw new Error('No configuration loader available.');
        }

        if (this.completed && !reLoad) {
            this.log('Configuration already loaded.');

            return of(this.cachedSettings);
        }

        if (!this.loading) {
            this.log('Cconfiguration loading started.');

            this.loading = true;
            this.completed = false;

            this.onLoad.next({
                data: {},
                status: 'loading'
            });
        }

        const obs = forkJoin(
            this.configLoaders
                .sort((l) => l.order)
                .map((configLoader) => {
                    const loaderName = configLoader.name;

                    if (reLoad || !this.fetchRequests[loaderName]) {
                        const loaderObs = configLoader.load().pipe(
                            tap((config) => {
                                this.log(loaderName, config);
                            }),
                            share()
                        );

                        this.fetchRequests[loaderName] = loaderObs.pipe(take(1), share());
                    }

                    return this.fetchRequests[loaderName];
                })
        ).pipe(
            map((configs) => {
                let mergedConfig: { [key: string]: unknown } = {};

                configs.forEach((config) => {
                    mergedConfig = { ...mergedConfig, ...config };
                });

                return mergedConfig;
            })
        );

        obs.subscribe(
            (config) => {
                this.cachedSettings = config;

                this.completed = true;
                this.loading = false;

                this.log('Configuration loading completed.');

                this.onLoad.next({
                    data: this.cachedSettings,
                    status: 'loaded'
                });
            },
            () => {
                this.completed = false;
                this.loading = false;
            }
        );

        return obs;
    }

    /**
     * The method to get setting value by key.
     * @param key The setting key.
     * @param defaultValue The default value to return if setting not found.
     */
    getValue<T>(key: string, defaultValue?: T): T;

    /**
     * The method to get setting value by key.
     * @param key The setting key.
     * @param defaultValue The default value to return if setting not found.
     */
    getValue(key: string, defaultValue?: unknown): unknown {
        const keyArray = key.split(/\.|:/);

        const result = keyArray.reduce((acc, current: string) => acc && acc[current], this.cachedSettings);

        if (result === undefined) {
            return defaultValue;
        }

        return result;
    }

    private log(msg: string, data?: { [key: string]: unknown }): void {
        if (!this.options.trace) {
            return;
        }

        if (data) {
            // eslint-disable-next-line no-console
            console.log(`[ConfigService] ${msg}, data: `, data);
        } else {
            // eslint-disable-next-line no-console
            console.log(`[ConfigService] ${msg}`);
        }
    }
}
