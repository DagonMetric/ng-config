// tslint:disable:no-any
// tslint:disable:no-unsafe-any

import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional, PLATFORM_ID } from '@angular/core';

import { CacheEntryOptions, CacheService, handleCacheResponse } from '@dagonmetric/ng-cache';
import { CONFIG_STATIC_DATA, ConfigLoader, ConfigStaticData } from '@dagonmetric/ng-config';
import { CONFIG_ENDPOINT_URL } from '@dagonmetric/ng-config/http-loader';
import { Observable, of } from 'rxjs';
import { map, retry } from 'rxjs/operators';

export interface ConfigCacheHttpLoaderOptions {
    disableLoadIfNonBrowserPlatform?: boolean;
    disableLoadIfStaticDataProvided?: boolean;
    cacheConfigKey?: string;
    endpointUrl?: string | (() => string);
    httpRetryCount?: number;
}

export const CONFIG_CACHE_HTTP_LOADER_OPTIONS = new InjectionToken<ConfigCacheHttpLoaderOptions>('CONFIG_CACHE_HTTP_LOADER_OPTIONS');

@Injectable({
    providedIn: 'root'
})
export class ConfigCacheHttpLoader implements ConfigLoader {
    private readonly _cacheConfigKey: string = 'app.config';
    private readonly _endpoint: string = '/appsettings.json';
    private readonly _disableLoad: boolean = false;
    private readonly _httpRetryCount: number = 2;

    constructor(private readonly _cacheService: CacheService, private readonly _httpClient: HttpClient,
        @Inject(PLATFORM_ID) platformId: Object,
        @Optional() @Inject(CONFIG_CACHE_HTTP_LOADER_OPTIONS) options?: ConfigCacheHttpLoaderOptions,
        @Optional() @Inject(CONFIG_ENDPOINT_URL) endpointUrl?: string,
        @Optional() @Inject(CONFIG_STATIC_DATA) staticData?: ConfigStaticData) {
        if (options && options.disableLoadIfNonBrowserPlatform && !isPlatformBrowser(platformId)) {
            this._disableLoad = true;
        }
        if (options && options.disableLoadIfStaticDataProvided && staticData && Object.keys(staticData).length > 0) {
            this._disableLoad = true;
        }

        if (options && options.endpointUrl) {
            this._endpoint = typeof options.endpointUrl === 'string' ? options.endpointUrl : options.endpointUrl();
        } else if (endpointUrl) {
            this._endpoint = endpointUrl;
        }

        if (options && options.cacheConfigKey) {
            this._cacheConfigKey = options.cacheConfigKey;
        }

        if (options && typeof options.httpRetryCount === 'number' && options.httpRetryCount > -1) {
            this._httpRetryCount = options.httpRetryCount;
        }
    }

    get async(): boolean {
        return true;
    }

    get source(): string {
        return 'CacheHttpLoader';
    }

    load(): Observable<{ [key: string]: any }> {
        if (this._disableLoad) {
            return of({});
        }

        return this._cacheService.getOrSet(this._cacheConfigKey,
            (entryOptions: CacheEntryOptions) => {
                return this._httpClient.get(this._endpoint, { observe: 'response' })
                    .pipe(
                        retry(this._httpRetryCount),
                        map((response: HttpResponse<{ [key: string]: any }>) => {
                            return handleCacheResponse<{ [key: string]: any }>(response,
                                `'${this._cacheConfigKey}.cacheinfo'`,
                                entryOptions);
                        })
                    );
            });
    }
}
