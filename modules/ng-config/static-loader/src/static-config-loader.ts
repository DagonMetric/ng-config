/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { Inject, Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { ConfigLoader } from '@dagonmetric/ng-config';

import { STATIC_CONFIG_LOADER_OPTIONS, StaticConfigLoaderOptions } from './static-config-loader-options';

/**
 * The config loader for providing static config data.
 */
@Injectable({
    providedIn: 'root'
})
export class StaticConfigLoader implements ConfigLoader {
    readonly data: { [key: string]: unknown } = {};

    get name(): string {
        return 'StaticConfigLoader';
    }

    get order(): number {
        return this.loaderOrder != null ? this.loaderOrder : 0;
    }

    private readonly loaderOrder?: number;

    constructor(@Inject(STATIC_CONFIG_LOADER_OPTIONS) options: StaticConfigLoaderOptions) {
        this.data = options.data;
        this.loaderOrder = options.order;
    }

    load(): Observable<{ [key: string]: unknown }> {
        return of(this.data);
    }
}
