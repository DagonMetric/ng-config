/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { Observable } from 'rxjs';

export interface ConfigProvider {
    readonly name: string;
    readonly order: number;
    load(): Observable<{ [key: string]: unknown }>;
}
