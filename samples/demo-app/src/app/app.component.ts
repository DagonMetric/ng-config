import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ConfigService } from '@dagonmetric/ng-config';

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

    private readonly destroySubject = new Subject();

    constructor(private readonly configService: ConfigService) {
        this.populateConfig();

        this.configService.valueChanges.pipe(takeUntil(this.destroySubject)).subscribe(() => {
            this.populateConfig();
        });
    }

    ngOnDestroy(): void {
        this.destroySubject.next();
        this.destroySubject.complete();
    }

    reload(): void {
        this.loading = true;

        this.configService.reload().subscribe(() => {
            {
                this.loading = false;
            }
        });
    }

    private populateConfig(): void {
        this.appOptions = this.configService.mapType(AppOptions);
        this.childOptions = this.configService.mapObject('app:child', this.childOptions);
        this.key1 = this.configService.getValue('key1') as string;
    }
}
