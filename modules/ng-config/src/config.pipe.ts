/**
 * @license
 * Copyright DagonMetric. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found under the LICENSE file in the root directory of this source tree.
 */

import { Injectable, Pipe, PipeTransform } from '@angular/core';

import { ConfigService } from './config.service';
import { ConfigValue } from './config-value';

/**
 * The config pipe to get configuration value by key.
 */
@Injectable()
@Pipe({
    name: 'config',
    pure: false
})
export class ConfigPipe implements PipeTransform {
    constructor(private readonly configService: ConfigService) {}

    transform(value: string): ConfigValue {
        return this.configService.getValue(value);
    }
}
