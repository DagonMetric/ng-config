/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { share, take, tap } from 'rxjs/operators';

import { ConfigProvider } from './config-provider';
import { CONFIG_PROVIDER } from './config-provider-token';
import { ConfigTemplate } from './config-template';
import { ConfigSection } from './config-section';

export interface ConfigLoadingContext {
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

@Injectable({
    providedIn: 'root'
})
export class ConfigRoot {
    readonly loadEvent: Observable<ConfigLoadingContext>;

    private readonly options: ConfigOptions;
    private readonly loadSubject = new BehaviorSubject<ConfigLoadingContext>({});
    private readonly fetchRequests: { [key: string]: Observable<ConfigTemplate> } = {};

    private loading = false;
    private completed = false;

    get providers(): ConfigProvider[] {
        return this.sortedConfigProviders;
    }

    private readonly sortedConfigProviders: ConfigProvider[];

    constructor(
        @Inject(CONFIG_PROVIDER) configProviders: ConfigProvider[],
        @Optional() @Inject(CONFIG_OPTIONS) options?: ConfigOptions
    ) {
        if (!configProviders || !configProviders.length) {
            throw new Error('No configuration provider available.');
        }

        this.sortedConfigProviders = configProviders.reverse();

        this.options = options || {};
        this.loadEvent = this.loadSubject.asObservable();
    }

    load(): Observable<ConfigTemplate[]> {
        return this.loadInternal(false);
    }

    reload(): Observable<ConfigTemplate[]> {
        return this.loadInternal(true);
    }

    getValue(key: string): string | null {
        // const keyArray = key.split(/\.|:/);
        // const result = keyArray.reduce((acc, current: string) => acc && acc[current], this.cachedConfig);

        for (const provider of this.providers) {
            const value = provider.getValue(key);
            if (value != null) {
                return value;
            }
        }

        return null;
    }

    setValue(key: string, value: string): void {
        for (const provider of this.providers) {
            provider.setValue(key, value);
        }
    }

    getSection(key: string): ConfigSection | null {
        return null;
    }

    private loadInternal(reload: boolean): Observable<ConfigTemplate[]> {
        if (this.completed && !reload) {
            this.log('Configuration already loaded.');

            return of([]);
        }

        if (!this.loading) {
            this.log('Cconfiguration loading started.');

            this.loading = true;
            this.completed = false;

            this.loadSubject.next({
                status: 'loading'
            });
        }

        const obs$ = forkJoin(
            this.providers.map((configProvider) => {
                const loaderName = configProvider.name;

                if (reload || !this.fetchRequests[loaderName]) {
                    const loaderObs = configProvider.load().pipe(
                        tap((config) => {
                            this.log(loaderName, config);
                        }),
                        share()
                    );

                    this.fetchRequests[loaderName] = loaderObs.pipe(take(1), share());
                }

                return this.fetchRequests[loaderName];
            })
        );

        obs$.subscribe(
            () => {
                this.completed = true;
                this.loading = false;

                this.log('Configuration loading completed.');

                this.loadSubject.next({
                    status: 'loaded'
                });
            },
            () => {
                this.completed = false;
                this.loading = false;
            }
        );

        return obs$;
    }

    private log(msg: string, optionalParam?: unknown): void {
        if (!this.options.trace) {
            return;
        }

        if (optionalParam) {
            // eslint-disable-next-line no-console
            console.log(`[ConfigService] ${msg}, data: `, optionalParam);
        } else {
            // eslint-disable-next-line no-console
            console.log(`[ConfigService] ${msg}`);
        }
    }
}
