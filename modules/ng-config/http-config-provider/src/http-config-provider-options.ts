/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { InjectionToken } from '@angular/core';

/**
 * The options for `HttpConfigProvider`.
 */
export interface HttpConfigProviderOptions {
    /**
     * The endpoint url string or InjectionToken.
     */
    endpoint: string | InjectionToken<string>;
    /**
     * The loader order.
     */
    order?: number;
}

export const HTTP_CONFIG_PROVIDER_OPTIONS = new InjectionToken<HttpConfigProviderOptions>('HttpConfigProviderOptions');
