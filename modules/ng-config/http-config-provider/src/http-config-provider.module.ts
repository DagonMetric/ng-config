/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { ModuleWithProviders, NgModule } from '@angular/core';

import { CONFIG_PROVIDER } from '@dagonmetric/ng-config';

import { HttpConfigProvider } from './http-config-provider';
import { HTTP_CONFIG_PROVIDER_OPTIONS, HttpConfigProviderOptions } from './http-config-provider-options';

/**
 * The `NGMODULE` for providing `HttpConfigProvider`.
 */
@NgModule({
    providers: [
        {
            provide: CONFIG_PROVIDER,
            useClass: HttpConfigProvider,
            multi: true
        }
    ]
})
export class HttpConfigProviderModule {
    /**
     * Call this method to provide options for configuring the `HttpConfigProvider`.
     * @param options An option object for `HttpConfigProvider`.
     */
    static init(options: HttpConfigProviderOptions): ModuleWithProviders<HttpConfigProviderModule> {
        return {
            ngModule: HttpConfigProviderModule,
            providers: [
                {
                    provide: HTTP_CONFIG_PROVIDER_OPTIONS,
                    useValue: options
                }
            ]
        };
    }
}
