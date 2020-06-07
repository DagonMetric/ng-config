/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { ChangeDetectorRef, Injectable, OnDestroy, Pipe, PipeTransform } from '@angular/core';

import { Subscription } from 'rxjs';

import { ConfigService } from './config.service';

/**
 * The config pipe to get configuration value by key.
 */
@Injectable()
@Pipe({
    name: 'config',
    pure: false
})
export class ConfigPipe implements PipeTransform, OnDestroy {
    private lastQuery: string | null = null;
    private lastValue = '';
    private onValueChanges?: Subscription | null;

    constructor(private readonly configService: ConfigService, private changeDetectorRef: ChangeDetectorRef) {}

    transform(query: string): string {
        if (!query || !query.length) {
            this.lastValue = '';
            this.lastQuery = null;

            return '';
        }

        if (query === this.lastQuery) {
            return this.lastValue;
        }

        this.update(query);
        this.unsubscribe();

        if (!this.onValueChanges) {
            this.onValueChanges = this.configService.valueChanges.subscribe(() => {
                this.lastQuery = null;
                this.update(query);
            });
        }

        return this.lastValue;
    }

    ngOnDestroy(): void {
        this.lastQuery = null;
        this.lastValue = '';

        this.unsubscribe();
    }

    private update(query: string): void {
        const configValue = this.configService.getValue(query);
        if (configValue == null || configValue === '') {
            if (this.lastValue !== '') {
                this.lastValue = '';
                this.lastQuery = query;
                this.changeDetectorRef.markForCheck();
            } else {
                this.lastQuery = query;
            }

            return;
        }

        const configValueStr = typeof configValue === 'string' ? configValue : JSON.stringify(configValue);
        if (configValueStr !== this.lastValue) {
            this.lastValue = configValueStr;
            this.lastQuery = query;
            this.changeDetectorRef.markForCheck();
        } else {
            this.lastQuery = query;
        }
    }

    private unsubscribe(): void {
        if (this.onValueChanges) {
            this.onValueChanges.unsubscribe();
            this.onValueChanges = undefined;
        }
    }
}
