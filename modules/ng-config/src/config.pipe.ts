import { Injectable, Pipe, PipeTransform } from '@angular/core';

import { ConfigService } from './config.service';
import { JsonValue } from './json-object';

/**
 * The config pipe to get setting value by key.
 */
@Injectable()
@Pipe({
    name: 'config'
})
export class ConfigPipe implements PipeTransform {
    constructor(private readonly _configService: ConfigService) { }

    transform(value: string): JsonValue | undefined {
        return this._configService.getSettings(value);
    }
}
