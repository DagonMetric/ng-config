/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { Inject, Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { ConfigProvider } from '@dagonmetric/ng-config';

import { STATIC_CONFIG_PROVIDER_OPTIONS, StaticConfigProviderOptions } from './static-config-provider-options';

/**
 * The config loader for providing static config data.
 */
@Injectable()
export class StaticConfigProvider implements ConfigProvider {
    readonly data: { [key: string]: unknown } = {};

    get name(): string {
        return 'StaticConfigProvider';
    }

    get order(): number {
        return this.loaderOrder != null ? this.loaderOrder : 0;
    }

    private readonly loaderOrder?: number;

    constructor(@Inject(STATIC_CONFIG_PROVIDER_OPTIONS) options: StaticConfigProviderOptions) {
        this.data = options.data;
        this.loaderOrder = options.order;
    }

    load(): Observable<{ [key: string]: unknown }> {
        return of(this.data);
    }
}
