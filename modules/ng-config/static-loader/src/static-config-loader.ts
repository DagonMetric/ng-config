/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

import { Observable, of } from 'rxjs';

import { ConfigLoader, JsonObject } from '@dagonmetric/ng-config';

export const CONFIG_DATA = new InjectionToken<JsonObject>('ConfigData');

/**
 * The config loader for providing static config data.
 */
@Injectable({
    providedIn: 'root'
})
export class StaticConfigLoader implements ConfigLoader {
    readonly settings: JsonObject = {};

    constructor(@Optional() @Inject(CONFIG_DATA) settings?: JsonObject) {
        if (settings) {
            this.settings = settings;
        }
    }

    get name(): string {
        return 'StaticConfigLoader';
    }

    load(): Observable<JsonObject> {
        return of(this.settings);
    }
}
