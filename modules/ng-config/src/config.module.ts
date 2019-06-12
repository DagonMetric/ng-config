/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';

import { ConfigPipe } from './config.pipe';
import { CONFIG_OPTIONS, ConfigOptions, ConfigService } from './config.service';
import { JsonObject } from './json-object';

export function configAppInitializerFactory(configService: ConfigService): () => Promise<JsonObject> {
    // tslint:disable-next-line:no-unnecessary-local-variable
    const res = async () => configService.load().toPromise();

    return res;
}

/**
 * The `NGMODULE` for providing `ConfigService` and `ConfigPipe`. Call `init` method to load configuration with `APP_INITIALIZER` factory.
 */
@NgModule({
    declarations: [
        ConfigPipe
    ],
    providers: [
        ConfigService
    ]
})
export class ConfigModule {
    /**
     * Call this method to load configuration with APP_INITIALIZER.
     * @param options An option object for ConfigService.
     */
    static init(options: ConfigOptions = {}): ModuleWithProviders {
        return {
            ngModule: ConfigModule,
            providers: [
                {
                    provide: CONFIG_OPTIONS,
                    useValue: options
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: (configAppInitializerFactory),
                    deps: [ConfigService],
                    multi: true
                }
            ]
        };
    }
}
