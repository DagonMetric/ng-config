/* eslint-disable max-classes-per-file */

import { ApplicationInitStatus, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { CONFIG_PROVIDER, ConfigProvider } from '../src/config-provider';
import { ConfigModule } from '../src/config.module';
import { ConfigService } from '../src/config.service';
import { CONFIG_OPTIONS, ConfigOptions } from '../src/config-options';
import { ConfigSection } from '../src';

@Injectable({
    providedIn: 'any'
})
export class DelayConfigProvider implements ConfigProvider {
    get name(): string {
        return 'DelayConfigProvider';
    }

    load(): Observable<ConfigSection> {
        return of({
            name: 'ng-config'
        }).pipe(delay(100));
    }
}

@Injectable({
    providedIn: 'any'
})
export class NonDelayConfigProvider implements ConfigProvider {
    get name(): string {
        return 'NonDelayConfigProvider';
    }

    load(): Observable<ConfigSection> {
        return of({
            name: 'ng-config'
        });
    }
}

describe('ConfigModule', () => {
    describe('init(loadOnStartUp: false)', () => {
        it("should return 'null' when calling 'ConfigService.getValue' with 'DelayConfigProvider'", () => {
            TestBed.configureTestingModule({
                imports: [ConfigModule.configure(false)],
                providers: [
                    {
                        provide: CONFIG_PROVIDER,
                        useClass: DelayConfigProvider,
                        multi: true
                    }
                ]
            });

            const configService = TestBed.inject<ConfigService>(ConfigService);

            void expect(configService.getValue('name')).toBe(null);
        });

        it("should return value when calling 'ConfigService.getValue' with 'NonDelayConfigProvider'", () => {
            TestBed.configureTestingModule({
                imports: [ConfigModule.configure(false)],
                providers: [
                    {
                        provide: CONFIG_PROVIDER,
                        useClass: NonDelayConfigProvider,
                        multi: true
                    }
                ]
            });

            const configService = TestBed.inject<ConfigService>(ConfigService);

            void expect(configService.getValue('name')).toBe('ng-config');
        });
    });

    describe('init(loadOnStartUp: true)', () => {
        beforeEach(async () => {
            TestBed.configureTestingModule({
                imports: [ConfigModule.configure()],
                providers: [
                    {
                        provide: CONFIG_PROVIDER,
                        useClass: DelayConfigProvider,
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

        it("should return value when calling 'ConfigService.getValue'", () => {
            const configService = TestBed.inject<ConfigService>(ConfigService);

            void expect(configService.getValue('name')).toBe('ng-config');
        });
    });
});
