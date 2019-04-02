// tslint:disable:no-any

import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { CONFIG_LOADER } from './config-loader-token';
import { CONFIG_STATIC_DATA, ConfigStaticLoader } from './config-static-loader';

@NgModule({
    providers: [
        {
            provide: CONFIG_LOADER,
            useClass: ConfigStaticLoader,
            multi: true
        }
    ]
})
export class ConfigStaticLoaderModule {
    constructor(@Optional() @SkipSelf() parentModule: ConfigStaticLoaderModule) {
        if (parentModule) {
            throw new Error('ConfigStaticLoaderModule has already been loaded, import in root module only.');
        }
    }

    static forRoot(data: { [key: string]: any }): ModuleWithProviders {
        return {
            ngModule: ConfigStaticLoaderModule,
            providers: [
                {
                    provide: CONFIG_STATIC_DATA,
                    useValue: data
                }
            ],
        };
    }
}
