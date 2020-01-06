/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

// tslint:disable: no-any

import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

import { Observable, of } from 'rxjs';

import { ConfigLoader } from '@dagonmetric/ng-config';

// tslint:disable-next-line: ban-types
export const CONFIG_DATA = new InjectionToken<Object>('ConfigData');

/**
 * The config loader for providing static config data.
 */
@Injectable({
    providedIn: 'root'
})
export class StaticConfigLoader implements ConfigLoader {

    readonly settings: { [key: string]: any } = {};

    // tslint:disable-next-line: ban-types
    constructor(@Optional() @Inject(CONFIG_DATA) settings?: Object) {
        if (settings) {
            this.settings = settings;
        }
    }

    get name(): string {
        return 'StaticConfigLoader';
    }

    load(): Observable<{ [key: string]: any }> {
        return of(this.settings);
    }
}
