import { Injectable, Pipe, PipeTransform } from '@angular/core';

import { ConfigService } from './config.service';

/**
 * The config pipe to get setting value by key.
 */
@Injectable()
@Pipe({
    name: 'config'
})
export class ConfigPipe implements PipeTransform {
    constructor(private readonly _configService: ConfigService) { }

    // tslint:disable-next-line: no-any
    transform(value: string): any {
        return this._configService.getValue(value);
    }
}
