// tslint:disable: no-floating-promises

import { Injectable } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { ConfigLoader } from '../src/config-loader';
import { CONFIG_LOADER } from '../src/config-loader-token';
import { ConfigPipe } from '../src/config.pipe';
import { ConfigService } from '../src/config.service';
import { JsonObject } from '../src/json-object';

/**
 * Test loader that implements ConfigLoader.
 */
@Injectable()
export class TestConfigLoader implements ConfigLoader {
    private readonly _settings = {
        name: 'ng-config',
        obj: {
            key1: 'value1',
            key2: 'value2'
        }
    };

    get name(): string {
        return 'TestConfigLoader';
    }

    load(): Observable<JsonObject> {
        return of(this._settings).pipe(delay(10));
    }
}

describe('ConfigPipe', () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [
                ConfigService,
                {
                    provide: CONFIG_LOADER,
                    useClass: TestConfigLoader,
                    multi: true
                }
            ]
        });

        const configService = TestBed.get<ConfigService>(ConfigService) as ConfigService;
        await configService.load().toPromise();
    });

    it('should be able to transform', inject([ConfigService], (configService: ConfigService) => {
        const pipe = new ConfigPipe(configService);
        expect(pipe.transform('name')).toEqual('ng-config');
    }));
});
