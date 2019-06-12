/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { map, share, take, tap } from 'rxjs/operators';

import { ConfigLoader } from './config-loader';
import { CONFIG_LOADER } from './config-loader-token';
import { JsonObject, JsonValue } from './json-object';

export interface ConfigLoadingContext {
    data: JsonObject;
    loading: boolean;
    loaded: boolean;
}

/**
 * Options for 'ConfigService'.
 */
export interface ConfigOptions {
    /**
     * Set true to log debug information.
     */
    trace?: boolean;
}

export const CONFIG_OPTIONS = new InjectionToken<ConfigOptions>('ConfigOptions');

/**
 * The core config service.
 */
@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    readonly loadEvent: Observable<ConfigLoadingContext>;

    private readonly _options: ConfigOptions;
    private readonly _cachedSettings: JsonObject = {};
    private readonly _onLoad = new BehaviorSubject<ConfigLoadingContext>({ data: {}, loading: false, loaded: false });
    private readonly _fetchRequests: { [key: string]: Observable<JsonObject> } = {};

    private _loading = false;
    private _completed = false;

    /**
     * Get the loader names.
     */
    get loaderNames(): string[] {
        if (!this._configLoaders || !this._configLoaders.length) {
            return [];
        }

        return this._configLoaders.map(configLoader => configLoader.name);
    }

    constructor(
        @Optional() @Inject(CONFIG_LOADER) private readonly _configLoaders?: ConfigLoader[],
        @Optional() @Inject(CONFIG_OPTIONS) options?: ConfigOptions) {
        this._options = options || {};
        this.loadEvent = this._onLoad.asObservable();
    }

    /**
     * The method to load and cache config data.
     * @param reLoad Flag to force reload the configuration.
     * @returns Returns the observable of loaded config data.
     * @throws {Error} Throws error if no 'CONFIG_LOADER' provided.
     */
    load(reLoad?: boolean): Observable<JsonObject> {
        if (!this._configLoaders || !this._configLoaders.length) {
            throw new Error('No configuration loader available.');
        }

        if (this._completed && !reLoad) {
            this.log('Configuration already loaded.');

            return of(this._cachedSettings);
        }

        if (!this._loading) {
            this.log('Cconfiguration loading started.');

            this._loading = true;
            this._completed = false;

            this._onLoad.next({
                data: {},
                loading: true,
                loaded: false
            });
        }

        const obs = forkJoin(
            this._configLoaders.map(configLoader => {
                const loaderName = configLoader.name;

                if (!reLoad && this._fetchRequests[loaderName]) {
                    return this._fetchRequests[loaderName];
                }

                const loaderObs = configLoader.load().pipe(
                    tap(config => {
                        this.log(loaderName, config);
                    }),
                    share()
                );

                this._fetchRequests[loaderName] = loaderObs.pipe(
                    take(1),
                    share()
                );

                return loaderObs;
            })
        ).pipe(
            map(configs => {
                let mergedConfig: JsonObject = {};

                configs.forEach(config => {
                    mergedConfig = { ...mergedConfig, ...config };
                });

                return mergedConfig;
            })
        );

        obs.subscribe((config) => {
            Object.assign(this._cachedSettings, config);

            this._completed = true;
            this._loading = false;

            this.log('Configuration loading completed.');

            this._onLoad.next({
                data: this._cachedSettings,
                loading: false,
                loaded: true
            });

        }, () => {
            this._completed = false;
            this._loading = false;
        });

        return obs;
    }

    /**
     * Get settings by key.
     * @param key The setting key.
     * @param defaultValue The default value to return if setting not found.
     */
    getSettings<T>(key: string, defaultValue?: T): T;

    /**
     * Get settings by key.
     * @param key The setting key.
     * @param defaultValue The default value to return if setting not found.
     */
    getSettings(key: string, defaultValue?: JsonValue): JsonValue | undefined {
        const keyArray = key.split(/\.|:/);

        const result = keyArray.reduce((acc, current: string) => acc && acc[current],
            this._cachedSettings);

        if (result === undefined) {
            return defaultValue;
        }

        return result;
    }

    private log(msg: string, data?: JsonObject): void {
        if (!this._options.trace) {
            return;
        }

        if (data) {
            // tslint:disable-next-line:no-console
            console.log(`[ConfigService] ${msg}, data: `, data);

        } else {
            // tslint:disable-next-line:no-console
            console.log(`[ConfigService] ${msg}`);
        }
    }
}
