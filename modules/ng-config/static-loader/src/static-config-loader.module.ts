/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { ModuleWithProviders, NgModule } from '@angular/core';

import { StaticConfigLoader } from './static-config-loader';

import { CONFIG_LOADER } from '@dagonmetric/ng-config';

import { STATIC_CONFIG_LOADER_OPTIONS, StaticConfigLoaderOptions } from './static-config-loader-options';

/**
 * The `NGMODULE` for providing `StaticConfigLoader`.
 */
@NgModule({
    providers: [
        {
            provide: CONFIG_LOADER,
            useClass: StaticConfigLoader,
            multi: true
        }
    ]
})
export class StaticConfigLoaderModule {
    /**
     * Provides options for `StaticConfigLoader`.
     * @param options An options object for `StaticConfigLoader`.
     */
    static withSettings(options: StaticConfigLoaderOptions): ModuleWithProviders {
        return {
            ngModule: StaticConfigLoaderModule,
            providers: [
                {
                    provide: STATIC_CONFIG_LOADER_OPTIONS,
                    useValue: options
                }
            ]
        };
    }
}
