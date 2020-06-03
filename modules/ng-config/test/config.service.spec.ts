// eslint-disable-next-line max-classes-per-file
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { CONFIG_PROVIDER, ConfigProvider, ConfigSection, ConfigService } from '../src';

export class TransientOptions {
    key1 = '';
    key2 = false;
    key3 = 0;
    key4 = {
        subKey1: '',
        subKey2: true,
        subKey3: 0,
        subKey4: null
    };
    key5 = 'value5';
}

@Injectable({
    providedIn: 'root'
})
export class RootOptions {
    key1 = '';
    key2 = false;
    key3 = 0;
    key4 = {
        subKey1: '',
        subKey2: true,
        subKey3: 0,
        subKey4: null
    };
    key5 = 'value5';
}

@Injectable({
    providedIn: 'any'
})
export class TestConfigProvider implements ConfigProvider {
    private readonly config = {
        name: 'ng-config',
        counter: '0',
        transient: {
            key1: 'value1',
            key2: 'true',
            key3: '1',
            key4: {
                subKey1: 'hello',
                subKey2: 'false',
                subKey3: '-10'
            }
        },
        root: {
            key1: 'value1',
            key2: 'true',
            key3: '1',
            key4: {
                subKey1: 'hello',
                subKey2: 'false',
                subKey3: '-10'
            }
        }
    };

    get name(): string {
        return 'TestConfigProvider';
    }

    load(): Observable<ConfigSection> {
        const c = Number(this.config.counter) + 1;
        if (c > 9) {
            return throwError('Error from provider.');
        }

        this.config.counter = c.toString();

        return of(this.config).pipe(delay(10));
    }
}

describe('ConfigService', () => {
    describe('load', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: CONFIG_PROVIDER,
                        useClass: TestConfigProvider,
                        multi: true
                    }
                ]
            });
        });

        it('should return merged config', (done: DoneFn) => {
            const configService = TestBed.inject<ConfigService>(ConfigService);

            configService.load().subscribe((config) => {
                void expect(config.name).toBe('ng-config');
                done();
            });
        });

        it("should return cached config if 'reLoad' is 'false'", (done: DoneFn) => {
            const configService = TestBed.inject<ConfigService>(ConfigService);

            for (let i = 0; i < 5; i++) {
                configService.load(false);
            }

            configService.load(false).subscribe((c1) => {
                void expect(c1.counter).toBe('1');
                done();
            });
        });

        it("should reload the config if 'reLoad' is 'true'", (done: DoneFn) => {
            const configService = TestBed.inject<ConfigService>(ConfigService);

            for (let i = 0; i < 5; i++) {
                configService.load(true);
            }

            configService.load().subscribe((config) => {
                void expect(config.counter).toBe('5');
                done();
            });
        });

        it('should throw an error message when provider throws error', (done: DoneFn) => {
            const configService = TestBed.inject<ConfigService>(ConfigService);

            for (let i = 0; i < 11; i++) {
                configService.load(true);
            }

            configService.load(true).subscribe({
                error: (error: Error): void => {
                    void expect(of(error)).toBeTruthy();
                    done();
                }
            });
        });
    });

    describe('getValue', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: CONFIG_PROVIDER,
                        useClass: TestConfigProvider,
                        multi: true
                    }
                ]
            });
        });

        it('should get string value', (done: DoneFn) => {
            const configService = TestBed.inject<ConfigService>(ConfigService);

            configService.load().subscribe(() => {
                void expect(configService.getValue('name')).toBe('ng-config');
                done();
            });
        });

        it('should get config section object value', (done: DoneFn) => {
            const configService = TestBed.inject<ConfigService>(ConfigService);

            configService.load().subscribe(() => {
                void expect(configService.getValue('transient')).toEqual({
                    key1: 'value1',
                    key2: 'true',
                    key3: '1',
                    key4: {
                        subKey1: 'hello',
                        subKey2: 'false',
                        subKey3: '-10'
                    }
                });
                done();
            });
        });

        it(`should get with dot '.' key separator`, (done: DoneFn) => {
            const configService = TestBed.inject<ConfigService>(ConfigService);

            configService.load().subscribe(() => {
                void expect(configService.getValue('transient.key1')).toBe('value1');
                done();
            });
        });

        it(`should get with colon ':' key separator`, (done: DoneFn) => {
            const configService = TestBed.inject<ConfigService>(ConfigService);

            configService.load().subscribe(() => {
                void expect(configService.getValue('transient:key1')).toBe('value1');
                done();
            });
        });
    });

    describe('map', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: CONFIG_PROVIDER,
                        useClass: TestConfigProvider,
                        multi: true
                    }
                ]
            });
        });

        it('should return mapped options', (done: DoneFn) => {
            const configService = TestBed.inject<ConfigService>(ConfigService);
            configService.load().subscribe(() => {
                const expectedOptions: TransientOptions = new TransientOptions();
                Object.assign(expectedOptions, {
                    key1: 'value1',
                    key2: true,
                    key3: 1,
                    key4: {
                        subKey1: 'hello',
                        subKey2: false,
                        subKey3: -10,
                        subKey4: null
                    },
                    key5: 'value5'
                });

                void expect(configService.map(TransientOptions)).toEqual(expectedOptions);
                done();
            });
        });

        it(`should return new instances with 'TransientOptions'`, (done: DoneFn) => {
            const configService = TestBed.inject<ConfigService>(ConfigService);
            configService.load().subscribe(() => {
                const options1 = configService.map(TransientOptions);
                const options2 = configService.map(TransientOptions);

                void expect(options1 !== options2).toBeTruthy();
                done();
            });
        });

        it(`should return same instance with 'RootOptions'`, (done: DoneFn) => {
            const configService = TestBed.inject<ConfigService>(ConfigService);
            configService.load().subscribe(() => {
                const options1 = configService.map(RootOptions);
                const options2 = configService.map(RootOptions);

                void expect(options1 === options2).toBeTruthy();
                done();
            });
        });
    });
});
