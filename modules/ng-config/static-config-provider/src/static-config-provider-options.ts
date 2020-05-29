/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { InjectionToken } from '@angular/core';

export interface StaticConfigProviderOptions {
    data: { [key: string]: unknown };
    order?: number;
}

export const STATIC_CONFIG_PROVIDER_OPTIONS = new InjectionToken<StaticConfigProviderOptions>(
    'StaticConfigProviderOptions'
);
