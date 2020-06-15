import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// ng-config
import { ConfigModule, NG_CONFIG_LOGGER } from '@dagonmetric/ng-config';
import { HttpConfigProviderModule } from '@dagonmetric/ng-config/http-config';

// Custom logger for ng-config
import { CustomConfigLogger } from './custom-config-logger';

import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
        CommonModule,
        BrowserModule,
        HttpClientModule,

        // ng-config imports
        //
        ConfigModule.configure(true, {
            debug: true
        }),
        HttpConfigProviderModule.configure({
            endpoint: 'https://us-central1-ng-config-demo.cloudfunctions.net/configuration'
        })
    ],
    providers: [
        // (Optional) Providing custom logger for ng-config's debug information.
        {
            provide: NG_CONFIG_LOGGER,
            useExisting: CustomConfigLogger
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
