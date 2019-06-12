/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { ModuleWithProviders, NgModule } from '@angular/core';

import { CONFIG_DATA, StaticConfigLoader } from './static-config-loader';

import { CONFIG_LOADER, JsonObject } from '@dagonmetric/ng-config';

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
     * Provides data for StaticConfigLoader.
     * @param data An object of configuration data.
     */
    static withSettings(settings: JsonObject): ModuleWithProviders {
        return {
            ngModule: StaticConfigLoaderModule,
            providers: [
                {
                    provide: CONFIG_DATA,
                    useValue: settings
                }
            ],
        };
    }
}
