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

import { ConfigProvider, ConfigSection } from '@dagonmetric/ng-config';

import { HTTP_CONFIG_PROVIDER_OPTIONS, HttpConfigProviderOptions } from './http-config-provider-options';

/**
 * Implements an HTTP client API for HttpConfigProvider that relies on the Angular HttpClient.
 */
@Injectable({
    providedIn: 'root'
})
export class HttpConfigProvider implements ConfigProvider {
    get name(): string {
        return 'HttpConfigProvider';
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
        @Inject(HTTP_CONFIG_PROVIDER_OPTIONS) options: HttpConfigProviderOptions
    ) {
        if (typeof options.endpoint === 'string') {
            this.configEndpoint = options.endpoint;
        } else {
            this.configEndpoint = injector.get(options.endpoint);
        }

        this.loaderOrder = options.order;
    }

    load(): Observable<ConfigSection> {
        return this.httpClient.get<ConfigSection>(this.configEndpoint);
    }
}
