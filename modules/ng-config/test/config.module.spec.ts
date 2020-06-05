// tslint:disable: no-floating-promises

import { ApplicationInitStatus, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Observable, of } from 'rxjs';

import { CONFIG_PROVIDER, ConfigProvider } from '../src/config-provider';
import { ConfigModule } from '../src/config.module';
import { ConfigService } from '../src/config.service';
import { CONFIG_OPTIONS, ConfigOptions } from '../src/config-options';
import { ConfigSection } from '../src';

@Injectable({
    providedIn: 'any'
})
export class TestConfigProvider implements ConfigProvider {
    get name(): string {
        return 'TestConfigProvider';
    }

    load(): Observable<ConfigSection> {
        return of({
            name: 'ng-config',
            obj: {
                key1: 'value1',
                key2: 'value2'
            }
        });
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
        await TestBed.inject<ApplicationInitStatus>(ApplicationInitStatus).donePromise;
    });

    it("should provide 'ConfigService'", () => {
        const configService = TestBed.inject<ConfigService>(ConfigService);

        void expect(configService).toBeDefined();
    });

    it("should provide 'ConfigOptions'", () => {
        const configOptions = TestBed.inject<ConfigOptions>(CONFIG_OPTIONS);

        void expect(configOptions).toBeDefined();
    });

    it("should load with 'APP_INITIALIZER'", () => {
        const configService = TestBed.inject<ConfigService>(ConfigService);

        void expect(configService.getValue('name')).toBe('ng-config');
    });
});
