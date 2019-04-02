import { APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { ConfigService, ENABLE_DEBUG_LOGGING } from './config.service';

@NgModule({
    providers: [
        ConfigService
    ]
})
export class ConfigModule {
    constructor(@Optional() @SkipSelf() parentModule: ConfigModule) {
        if (parentModule) {
            throw new Error('ConfigModule has already been loaded, import in root module only.');
        }
    }

    static forRoot(config: { enableDebugLogging?: boolean } = {}): ModuleWithProviders {
        return {
            ngModule: ConfigModule,
            providers: [
                {
                    provide: ENABLE_DEBUG_LOGGING,
                    useValue: config.enableDebugLogging
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

// tslint:disable-next-line:no-any
export function configAppInitializerFactory(configService: ConfigService): () => Promise<any> {
    // tslint:disable-next-line:no-unnecessary-local-variable
    const res = async () => configService.load();

    return res;
}
