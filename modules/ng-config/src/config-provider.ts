/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { InjectionToken } from '@angular/core';

import { Observable } from 'rxjs';

import { ConfigSection } from './config-value';

/**
 * The ConfigProvider interface.
 */
export interface ConfigProvider {
    readonly name: string;
    load(): Observable<ConfigSection>;
}

export const CONFIG_PROVIDER = new InjectionToken<ConfigProvider>('ConfigProvider');
