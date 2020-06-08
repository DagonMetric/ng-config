import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { ConfigModule, NG_CONFIG_LOGGER } from '@dagonmetric/ng-config';
import { HttpConfigProviderModule } from '@dagonmetric/ng-config/http-config-provider';

import { AppComponent } from './app.component';
import { CustomConfigLogger } from './custom-config-logger';

@NgModule({
    declarations: [AppComponent],
    imports: [
        CommonModule,
        BrowserModule,
        HttpClientModule,

        ConfigModule.configure(true, {
            debug: true
        }),
        HttpConfigProviderModule.configure({
            endpoint: 'https://us-central1-ng-config-demo.cloudfunctions.net/configuration'
        })
    ],
    providers: [
        // Providing custom logger for ng-config
        {
            provide: NG_CONFIG_LOGGER,
            useExisting: CustomConfigLogger
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
