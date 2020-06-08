/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { InjectionToken } from '@angular/core';

/**
 * Custom logger interface for debug information.
 */
export interface Logger {
    debug(message: string, data?: { [key: string]: unknown }): void;
}

export const NG_CONFIG_LOGGER = new InjectionToken<Logger>('NG-CONFIG Logger');
