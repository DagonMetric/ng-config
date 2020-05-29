/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { ModuleWithProviders, NgModule } from '@angular/core';

import { StaticConfigProvider } from './static-config-provider';

import { CONFIG_PROVIDER } from '@dagonmetric/ng-config';

import { STATIC_CONFIG_PROVIDER_OPTIONS, StaticConfigProviderOptions } from './static-config-provider-options';

/**
 * The `NGMODULE` for providing `StaticConfigProvider`.
 */
@NgModule({
    providers: [
        {
            provide: CONFIG_PROVIDER,
            useClass: StaticConfigProvider,
            multi: true
        }
    ]
})
export class StaticConfigProviderModule {
    /**
     * Provides options for `StaticConfigProvider`.
     * @param options An options object for `StaticConfigProvider`.
     */
    static withSettings(options: StaticConfigProviderOptions): ModuleWithProviders {
        return {
            ngModule: StaticConfigProviderModule,
            providers: [
                {
                    provide: STATIC_CONFIG_PROVIDER_OPTIONS,
                    useValue: options
                }
            ]
        };
    }
}
