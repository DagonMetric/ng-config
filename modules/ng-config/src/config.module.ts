/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';

import { ConfigService } from './config.service';
import { CONFIG_OPTIONS, ConfigOptions } from './config-options';
import { ConfigSection } from './config-value';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function configAppInitializerFactory(configService: ConfigService): () => Promise<ConfigSection> {
    const res = async () => configService.load().toPromise();

    return res;
}

/**
 * The `NGMODULE` for providing `ConfigService`. Call `init` method to provide options for `ConfigService`.
 */
@NgModule({
    providers: [ConfigService]
})
export class ConfigModule {
    /**
     * Call this method in root module to provide options for `ConfigService`.
     * @param loadOnStartUp If `true` configuration values are loaded at app starts. Default is `true`.
     * @param options Option object for `ConfigService`.
     */
    static init(loadOnStartUp: boolean = true, options: ConfigOptions = {}): ModuleWithProviders<ConfigModule> {
        return {
            ngModule: ConfigModule,
            providers: [
                {
                    provide: CONFIG_OPTIONS,
                    useValue: options
                },
                loadOnStartUp
                    ? {
                          provide: APP_INITIALIZER,
                          useFactory: configAppInitializerFactory,
                          deps: [ConfigService],
                          multi: true
                      }
                    : []
            ]
        };
    }
}
