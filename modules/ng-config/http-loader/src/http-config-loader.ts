/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';

import { ConfigLoader } from '@dagonmetric/ng-config';

import { HTTP_CONFIG_LOADER_OPTIONS, HttpConfigLoaderOptions } from './http-config-loader-options';

/**
 * Implements an HTTP client API for ConfigLoader that relies on the Angular HttpClient.
 */
@Injectable({
    providedIn: 'root'
})
export class HttpConfigLoader implements ConfigLoader {
    get name(): string {
        return 'HttpConfigLoader';
    }

    get endpoint(): string {
        return this.configEndpoint;
    }

    get order(): number {
        return this.loaderOrder != null ? this.loaderOrder : 0;
    }

    private readonly configEndpoint: string;
    private readonly loaderOrder?: number;

    constructor(
        private readonly httpClient: HttpClient,
        injector: Injector,
        @Inject(HTTP_CONFIG_LOADER_OPTIONS) options: HttpConfigLoaderOptions
    ) {
        if (typeof options.endpoint === 'string') {
            this.configEndpoint = options.endpoint;
        } else {
            this.configEndpoint = injector.get(options.endpoint);
        }

        this.loaderOrder = options.order;
    }

    load(): Observable<{ [key: string]: unknown }> {
        return this.httpClient.get<{ [key: string]: unknown }>(this.configEndpoint);
    }
}
