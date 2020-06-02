// tslint:disable: no-floating-promises

import { ApplicationInitStatus, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { ConfigProvider } from '../src/config-provider';
import { CONFIG_PROVIDER } from '../src/config-provider-token';
import { ConfigModule } from '../src/config.module';
import { ConfigService } from '../src/config.service';
import { CONFIG_OPTIONS, ConfigOptions } from '../src/config-options';
import { ConfigSection } from '../src';

@Injectable({
    providedIn: 'any'
})
export class TestConfigProvider implements ConfigProvider {
    private readonly config = {
        name: 'ng-config',
        obj: {
            key1: 'value1',
            key2: 'value2'
        }
    };

    get name(): string {
        return 'TestConfigLoader';
    }

    load(): Observable<ConfigSection> {
        return of(this.config).pipe(delay(10));
    }
}

describe('ConfigModule', () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [ConfigModule.init()],
            providers: [
                {
                    provide: CONFIG_PROVIDER,
                    useClass: TestConfigProvider,
                    multi: true
                }
            ]
        });

        // until https://github.com/angular/angular/issues/24218 is fixed
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        await TestBed.get<ApplicationInitStatus>(ApplicationInitStatus).donePromise;
    });

    it("should provide 'ConfigService'", () => {
        const configService = TestBed.inject<ConfigService>(ConfigService);

        void expect(configService).toBeDefined();
    });

    it("should provide 'ConfigOptions'", () => {
        const configOptions = TestBed.get<ConfigOptions>(CONFIG_OPTIONS) as ConfigOptions;

        void expect(configOptions).toBeDefined();
    });

    it("should load with 'APP_INITIALIZER'", () => {
        const configService = TestBed.get<ConfigService>(ConfigService) as ConfigService;

        void expect(configService.getValue('name')).toBe('ng-config');
    });
});
