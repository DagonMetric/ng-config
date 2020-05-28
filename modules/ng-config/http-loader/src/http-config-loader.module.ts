/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { ModuleWithProviders, NgModule } from '@angular/core';

import { CONFIG_LOADER } from '@dagonmetric/ng-config';

import { HttpConfigLoader } from './http-config-loader';
import { HTTP_CONFIG_LOADER_OPTIONS, HttpConfigLoaderOptions } from './http-config-loader-options';

/**
 * The `NGMODULE` for providing `HttpConfigLoader`.
 */
@NgModule({
    providers: [
        {
            provide: CONFIG_LOADER,
            useClass: HttpConfigLoader,
            multi: true
        }
    ]
})
export class HttpConfigLoaderModule {
    /**
     * Call this method to provide options for configuring the `HttpConfigLoader`.
     * @param options An option object for `HttpConfigLoader`.
     */
    static withOptions(options: HttpConfigLoaderOptions): ModuleWithProviders {
        return {
            ngModule: HttpConfigLoaderModule,
            providers: [
                {
                    provide: HTTP_CONFIG_LOADER_OPTIONS,
                    useValue: options
                }
            ]
        };
    }
}
