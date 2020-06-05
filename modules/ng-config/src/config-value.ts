/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

export type ConfigValueBasic = string | string[] | number | boolean;

export interface ConfigSection {
    [key: string]: ConfigValueBasic | ConfigSection | null;
}

export type ConfigValue = ConfigValueBasic | ConfigSection | null;
