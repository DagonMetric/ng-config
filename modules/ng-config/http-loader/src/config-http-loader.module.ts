import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { CONFIG_LOADER } from '@dagonmetric/ng-config';

import { CONFIG_ENDPOINT_URL } from './config-endpoint-url';
import { ConfigHttpLoader } from './config-http-loader';

@NgModule({
    providers: [
        {
            provide: CONFIG_LOADER,
            useClass: ConfigHttpLoader,
            multi: true
        }
    ]
})
export class ConfigHttpLoaderModule {
    constructor(@Optional() @SkipSelf() parentModule: ConfigHttpLoaderModule) {
        if (parentModule) {
            throw new Error('ConfigHttpLoaderModule has already been loaded, import in root module only.');
        }
    }

    static forRoot(endpointUrl: string): ModuleWithProviders {
        return {
            ngModule: ConfigHttpLoaderModule,
            providers: [
                {
                    provide: CONFIG_ENDPOINT_URL,
                    useValue: endpointUrl
                }
            ],
        };
    }
}
