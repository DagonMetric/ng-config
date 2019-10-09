// tslint:disable: no-floating-promises

import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { ConfigLoader } from '../src/config-loader';
import { CONFIG_LOADER } from '../src/config-loader-token';
import { CONFIG_OPTIONS, ConfigService } from '../src/config.service';

/**
 * Test loader that implements ConfigLoader.
 */
@Injectable()
export class TestConfigLoader implements ConfigLoader {
    private readonly _settings = {
        name: 'ng-config',
        counter: 0,
        obj: {
            key1: 'value1',
            key2: 'value2'
        }
    };

    get name(): string {
        return 'TestConfigLoader';
    }

    // tslint:disable-next-line: no-any
    load(): Observable<{ [key: string]: any }> {
        this._settings.counter++;

        if (this._settings.counter > 10) {
            return throwError('loaderError');
        }

        return of(this._settings).pipe(delay(10));
    }
}

describe('ConfigService', () => {
    it('should be created', () => {
        TestBed.configureTestingModule({});

        const configService = TestBed.get<ConfigService>(ConfigService);

        expect(configService).toBeDefined();
        expect(configService instanceof ConfigService).toBeTruthy();
    });

    describe('loaderNames', () => {
        it('should return loader names', () => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: CONFIG_LOADER,
                        useClass: TestConfigLoader,
                        multi: true
                    }
                ]
            });

            const configService = TestBed.get<ConfigService>(ConfigService) as ConfigService;

            expect(configService.loaderNames.length).toBe(1);
            expect(configService.loaderNames[0]).toBe('TestConfigLoader');
        });

        it('should return empty array if no loader provided', () => {
            TestBed.configureTestingModule({});

            const configService = TestBed.get<ConfigService>(ConfigService) as ConfigService;

            expect(configService.loaderNames.length).toBe(0);
        });
    });

    describe('load', () => {
        it("should work with 'ConfigLoader'", (done: DoneFn) => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: CONFIG_OPTIONS,
                        useValue: { trace: true }
                    },
                    {
                        provide: CONFIG_LOADER,
                        useClass: TestConfigLoader,
                        multi: true
                    }
                ]
            });

            const configService = TestBed.get<ConfigService>(ConfigService) as ConfigService;
            configService.load().subscribe(configs => {
                expect(configs.name).toBe('ng-config');
                done();
            });
        });

        it("should return cached settings if 'reLoad' is 'false'", (done: DoneFn) => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: CONFIG_LOADER,
                        useClass: TestConfigLoader,
                        multi: true
                    }
                ]
            });

            const configService = TestBed.get<ConfigService>(ConfigService) as ConfigService;

            for (let i = 0; i < 5; i++) {
                configService.load(false);
            }

            configService.load().subscribe(c1 => {
                expect(c1.counter).toBe(1);

                configService.load().subscribe(c2 => {
                    expect(c2.counter).toBe(1);
                    done();
                });
            });
        });

        it("should reload the settings if 'reLoad' is 'true'", (done: DoneFn) => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: CONFIG_LOADER,
                        useClass: TestConfigLoader,
                        multi: true
                    }
                ]
            });

            const configService = TestBed.get<ConfigService>(ConfigService) as ConfigService;

            for (let i = 0; i < 10; i++) {
                configService.load(true);
            }

            configService.load().subscribe(configs => {
                expect(configs.counter).toBe(10);
                done();
            });
        });

        it("should throw an error message if no 'ConfigLoader' is provided", () => {
            TestBed.configureTestingModule({});

            const configService = TestBed.get<ConfigService>(ConfigService) as ConfigService;

            expect(() => configService.load()).toThrowError('No configuration loader available.');
        });

        it('should throw an error message when loader returns an error', (done: DoneFn) => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: CONFIG_LOADER,
                        useClass: TestConfigLoader,
                        multi: true
                    }
                ]
            });

            const configService = TestBed.get<ConfigService>(ConfigService) as ConfigService;

            for (let i = 0; i < 10; i++) {
                configService.load(true);
            }

            configService.load(true).subscribe({
                error(actualError: Error): void {
                    expect(of(actualError)).toBeTruthy();
                    expect(actualError).not.toBeNull();
                    expect(actualError).not.toBeUndefined();
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
                        provide: CONFIG_LOADER,
                        useClass: TestConfigLoader,
                        multi: true
                    }
                ]
            });

            const configService = TestBed.get<ConfigService>(ConfigService) as ConfigService;
            configService.load().subscribe(() => {
                expect(configService.getValue('name')).toBe('ng-config');
                done();
            });
        });

        it('should work with object accessor key', (done: DoneFn) => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: CONFIG_LOADER,
                        useClass: TestConfigLoader,
                        multi: true
                    }
                ]
            });

            const configService = TestBed.get<ConfigService>(ConfigService) as ConfigService;
            configService.load().subscribe(() => {
                expect(configService.getValue('obj.key1')).toBe('value1');
                done();
            });
        });

        it('should return default value', (done: DoneFn) => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: CONFIG_LOADER,
                        useClass: TestConfigLoader,
                        multi: true
                    }
                ]
            });

            const configService = TestBed.get<ConfigService>(ConfigService) as ConfigService;
            configService.load().subscribe(() => {
                expect(configService.getValue('key1', 'defaultValue')).toBe('defaultValue');
                done();
            });
        });
    });
});
