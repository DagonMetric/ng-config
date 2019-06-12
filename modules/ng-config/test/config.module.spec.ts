// tslint:disable: no-floating-promises

import { ApplicationInitStatus, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { ConfigLoader } from '../src/config-loader';
import { CONFIG_LOADER } from '../src/config-loader-token';
import { ConfigModule } from '../src/config.module';
import { CONFIG_OPTIONS, ConfigOptions, ConfigService } from '../src/config.service';
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

describe('ConfigModule', () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                ConfigModule.init()
            ],
            providers: [
                {
                    provide: CONFIG_LOADER,
                    useClass: TestConfigLoader,
                    multi: true
                }
            ]
        });

        // until https://github.com/angular/angular/issues/24218 is fixed
        // tslint:disable-next-line: no-unsafe-any
        await TestBed.get<ApplicationInitStatus>(ApplicationInitStatus).donePromise;
    });

    it("should provide 'ConfigService'", () => {
        const configService = TestBed.get<ConfigService>(ConfigService);

        expect(configService).toBeDefined();
    });

    it("should provide 'ConfigOptions'", () => {
        const configOptions = TestBed.get<ConfigOptions>(CONFIG_OPTIONS) as ConfigOptions;

        expect(configOptions).toBeDefined();
        expect(configOptions.trace).toBeFalsy();
    });

    it("should load with 'APP_INITIALIZER'", () => {
        const configService = TestBed.get<ConfigService>(ConfigService) as ConfigService;

        expect(configService.getValue('name')).toBe('ng-config');
    });
});
