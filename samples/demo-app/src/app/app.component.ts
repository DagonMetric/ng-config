import { Component, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ConfigService } from '@dagonmetric/ng-config';

import { AppOptions } from './app-options';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnDestroy {
    loading?: boolean = false;
    appOptions?: AppOptions;
    messages: string[] = [];

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
    }
}
