import { Injectable, Pipe, PipeTransform } from '@angular/core';

import { ConfigService } from './config.service';
import { ConfigValue } from './config-value';

/**
 * The config pipe to get setting value by key.
 */
@Injectable()
@Pipe({
    name: 'config'
})
export class ConfigPipe implements PipeTransform {
    constructor(private readonly configService: ConfigService) {}

    transform(value: string): ConfigValue {
        return this.configService.getValue(value);
    }
}
