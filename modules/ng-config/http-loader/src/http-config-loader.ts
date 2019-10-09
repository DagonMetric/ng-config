/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Injector, Optional } from '@angular/core';

import { Observable } from 'rxjs';

import { ConfigLoader } from '@dagonmetric/ng-config';

/**
 * The options for HttpConfigLoader.
 */
export interface HttpConfigLoaderOptions {
    /**
     * The endpoint url string or InjectionToken.
     */
    endpoint?: string | InjectionToken<string>;
}

export const HTTP_CONFIG_LOADER_OPTIONS = new InjectionToken<HttpConfigLoaderOptions>('HttpConfigLoaderOptions');

/**
 * Implements an HTTP client API for ConfigLoader that relies on the Angular HttpClient.
 */
@Injectable({
    providedIn: 'root'
})
export class HttpConfigLoader implements ConfigLoader {
    private readonly _endpoint: string = '/appsettings.json';

    constructor(
        private readonly _httpClient: HttpClient,
        injector: Injector,
        @Optional() @Inject(HTTP_CONFIG_LOADER_OPTIONS) options: HttpConfigLoaderOptions) {
        if (options && options.endpoint) {
            if (typeof options.endpoint === 'string') {
                this._endpoint = options.endpoint;
            } else {
                this._endpoint = injector.get(options.endpoint);
            }
        }
    }

    get name(): string {
        return 'HttpConfigLoader';
    }

    get endpoint(): string {
        return this._endpoint;
    }

    // tslint:disable-next-line: no-any
    load(): Observable<{ [key: string]: any }> {
        // tslint:disable-next-line: no-any
        return this._httpClient.get<{ [key: string]: any }>(this._endpoint);
    }
}
