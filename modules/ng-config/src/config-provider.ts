/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { Observable } from 'rxjs';

import { ConfigTemplate } from './config-template';

/**
 * The ConfigProvider interface.
 */
export interface ConfigProvider {
    readonly name: string;
    load(): Observable<ConfigTemplate>;
    getValue(key: string): string | null;
    setValue(key: string, value: string): void;
}
