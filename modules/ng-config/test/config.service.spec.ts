// tslint:disable: no-floating-promises

import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { ConfigProvider } from '../src/config-provider';
import { CONFIG_PROVIDER } from '../src/config-provider-token';
import { ConfigService } from '../src/config.service';
import { CONFIG_OPTIONS } from '../src/config-options';
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
describe('ConfigService', () => {
    it('should be created', () => {
        TestBed.configureTestingModule({});

        const configService = TestBed.inject<ConfigService>(ConfigService);

        void expect(configService).toBeDefined();
    });

    describe('loaderNames', () => {
        it('should has any provider', () => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: CONFIG_PROVIDER,
                        useClass: TestConfigProvider,
                        multi: true
                    }
                ]
            });

            const configService = TestBed.inject<ConfigService>(ConfigService);

            void expect(configService.providers.length).toBe(1);
        });

        it('should return empty array if no loader provided', () => {
            TestBed.configureTestingModule({});

            const configService = TestBed.inject<ConfigService>(ConfigService);

            void expect(configService.providers.length).toBe(0);
        });
    });

    describe('load', () => {
        it("should work with 'ConfigProvider'", (done: DoneFn) => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: CONFIG_OPTIONS,
                        useValue: { trace: true }
                    },
                    {
                        provide: CONFIG_PROVIDER,
                        useClass: TestConfigProvider,
                        multi: true
                    }
                ]
            });

            const configService = TestBed.inject<ConfigService>(ConfigService);

            configService.load().subscribe((config) => {
                void expect(config.name).toBe('ng-config');
                done();
            });
        });

        it("should return cached settings if 'reLoad' is 'false'", (done: DoneFn) => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: CONFIG_PROVIDER,
                        useClass: TestConfigProvider,
                        multi: true
                    }
                ]
            });

            const configService = TestBed.inject<ConfigService>(ConfigService);

            for (let i = 0; i < 5; i++) {
                configService.load(false);
            }

            configService.load().subscribe((c1) => {
                void expect(c1.counter).toBe(1);

                configService.load().subscribe((c2) => {
                    void expect(c2.counter).toBe(1);
                    done();
                });
            });
        });

        it("should reload the settings if 'reLoad' is 'true'", (done: DoneFn) => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: CONFIG_PROVIDER,
                        useClass: TestConfigProvider,
                        multi: true
                    }
                ]
            });

            const configService = TestBed.inject<ConfigService>(ConfigService);

            for (let i = 0; i < 10; i++) {
                configService.load(true);
            }

            configService.load().subscribe((configs) => {
                void expect(configs.counter).toBe(10);
                done();
            });
        });

        it("should throw an error message if no 'ConfigLoader' is provided", () => {
            TestBed.configureTestingModule({});

            const configService = TestBed.inject<ConfigService>(ConfigService);

            void expect(() => configService.load()).toThrowError('No configuration loader available.');
        });

        it('should throw an error message when loader returns an error', (done: DoneFn) => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: CONFIG_PROVIDER,
                        useClass: TestConfigProvider,
                        multi: true
                    }
                ]
            });

            const configService = TestBed.get<ConfigService>(ConfigService) as ConfigService;

            for (let i = 0; i < 10; i++) {
                configService.load(true);
            }

            configService.load(true).subscribe({
                error: (actualError: Error): void => {
                    void expect(of(actualError)).toBeTruthy();
                    void expect(actualError).not.toBeNull();
                    void expect(actualError).not.toBeUndefined();
                    done();
                }
            });
        });
    });

    describe('getValue', () => {
        it('should work with simple key', (done: DoneFn) => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: CONFIG_PROVIDER,
                        useClass: TestConfigProvider,
                        multi: true
                    }
                ]
            });

            const configService = TestBed.inject<ConfigService>(ConfigService);
            configService.load().subscribe(() => {
                void expect(configService.getValue('name')).toBe('ng-config');
                done();
            });
        });

        it('should work with object accessor key', (done: DoneFn) => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: CONFIG_PROVIDER,
                        useClass: TestConfigProvider,
                        multi: true
                    }
                ]
            });

            const configService = TestBed.inject<ConfigService>(ConfigService);
            configService.load().subscribe(() => {
                void expect(configService.getValue('obj.key1')).toBe('value1');
                done();
            });
        });
    });
});
