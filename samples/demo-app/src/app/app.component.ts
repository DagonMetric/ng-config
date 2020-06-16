import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ConfigService } from '@dagonmetric/ng-config';

import { environment } from '../environments/environment';

import { AppOptions } from './app-options';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnDestroy {
    loading?: boolean = false;
    appOptions?: AppOptions;
    childOptions = {
        key1: '',
        key2: true
    };
    key1 = '';

    isProd?: boolean;

    private readonly destroySubject = new Subject();

    constructor(private readonly configService: ConfigService) {
        this.isProd = environment.production;

        this.populateConfigValues();

        // The event which will be triggered whenever configuration value changes
        this.configService.valueChanges.pipe(takeUntil(this.destroySubject)).subscribe(() => {
            this.populateConfigValues();
        });
    }

    ngOnDestroy(): void {
        this.destroySubject.next();
        this.destroySubject.complete();
    }

    reload(): void {
        this.loading = true;

        // Call reload() to get fresh configuration values from providers
        this.configService
            .reload()
            .pipe(takeUntil(this.destroySubject))
            .subscribe(() => {
                {
                    this.loading = false;
                }
            });
    }

    private populateConfigValues(): void {
        // Get with string key
        this.key1 = this.configService.getValue('key1') as string;

        // Map with options class
        this.appOptions = this.configService.mapType('app', AppOptions);

        // Map with options object
        this.childOptions = this.configService.mapObject('app:child', this.childOptions);
    }
}
