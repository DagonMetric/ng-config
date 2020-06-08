// eslint-disable-next-line max-classes-per-file
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import {
    CONFIG_OPTIONS,
    CONFIG_PROVIDER,
    ConfigOptions,
    ConfigProvider,
    ConfigSection,
    ConfigService,
    NG_CONFIG_LOGGER
} from '../src';

const dateObj = new Date();

export class TransientOptions {
    // string -> string
    str1 = 'value1';
    // boolean -> string
    str2 = '';
    // number -> string
    str3 = '';
    // Set null
    str4 = '';

    // number -> number
    num1 = 0;
    // string -> number
    num2 = 0;
    // Set null
    num3 = 0;
    // incompatible
    num4 = 1;

    // boolean -> boolean
    bool1 = false;
    // string (true/false) -> boolean
    bool2 = false;
    // string (on) -> boolean
    bool3 = false;
    // number (1) -> boolean
    bool4 = false;
    // number (yes) -> boolean
    bool5 = false;
    // Set null
    bool6 = false;
    // incompatible
    bool7 = false;

    // array -> array
    arr1 = [];
    // string -> array
    arr2 = [];
    // Set null
    arr3 = [];
    // incompatible
    arr4 = [];
    // incompatible
    arr5 = [];

    child = {
        // string
        key1: '',
        // boolean
        key2: true,
        // number
        key3: 0,
        // array
        key4: [],
        // null
        key5: null
    };

    child2 = {
        key1: '',
        key2: true
    };

    // Not mapped values
    //
    extraKey = 'extra';
    date = dateObj;
}

@Injectable({
    providedIn: 'root'
})
export class RootOptions {
    key1 = '';
    key2 = false;
    key3 = 0;
}

export class NotMapped {
    key1 = '';
    key2 = false;
    key3 = 0;
}

@Injectable({
    providedIn: 'any'
})
export class TestConfigProvider implements ConfigProvider {
    get name(): string {
        return 'TestConfigProvider';
    }

    private config = {
        name: 'ng-config',
        transient: {
            str1: 'value1',
            str2: true,
            str3: 10,
            str4: null,

            num1: 100,
            num2: '100.05',
            num3: null,
            // incompatible
            num4: 'yes',

            bool1: true,
            bool2: 'true',
            bool3: 'on',
            bool4: 1,
            bool5: 'yes',
            bool6: null,
            // incompatible
            bool7: [],

            arr1: ['item1', 'item2'],
            arr2: 'item1;item2',
            arr3: null,
            arr4: {},
            // incompatible
            arr5: ['hello', 1, true] as string[],

            child: {
                key1: 'hello',
                key2: false,
                key3: -10,
                key4: ['sub1', 'sub2'],
                key5: 'world'
            },

            child2: false,

            // Not mapped
            date: ''
        },
        root: {
            key1: 'value1',
            key2: true,
            key3: 1
        },
        str: 'a',
        bool: true,
        arr: ['a'],
        lastNum: 0,
        noValue: null
    };

    private counter = 0;

    load(): Observable<ConfigSection> {
        // Simulate changes
        //

        const config = { ...this.config };

        if (!config.arr || !Array.isArray(config.arr)) {
            config.arr = [];
        }

        config.arr = [...config.arr];
        config.root = { ...config.root };
        config.transient = { ...config.transient };

        if (this.counter === 1) {
            config.str = 'b';
        } else if (this.counter === 4) {
            config.arr.push('b');
            config.arr.push('c');
        } else if (this.counter === 5) {
            config.arr = ['a', 'c', 'b'];
        } else if (this.counter === 6) {
            config.arr = null as never;
        } else if (this.counter === 8) {
            config.root.key3 = 8;
        } else if (this.counter === 9) {
            config.lastNum = this.counter;
        }

        ++this.counter;

        this.config = { ...config };

        if (this.counter > 10) {
            return throwError('Error from provider.');
        }

        return of(config).pipe(delay(1));
    }
}

@Injectable({
    providedIn: 'root'
})
export class CustomConfigLogger {
    messages: string[] = [];

    debug(message: string, data: unknown): void {
        if (data) {
            this.messages.push(`${message}, data: ${JSON.stringify(data)}`);
        } else {
            this.messages.push(message);
        }
    }
}

describe('ConfigService', () => {
    describe('log', () => {
        let configService: ConfigService;
        let logger: CustomConfigLogger;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: CONFIG_PROVIDER,
                        useClass: TestConfigProvider,
                        multi: true
                    },
                    {
                        provide: CONFIG_OPTIONS,
                        useValue: {
                            debug: true
                        } as ConfigOptions
                    },
                    {
                        provide: NG_CONFIG_LOGGER,
                        useExisting: CustomConfigLogger
                    }
                ]
            });

            configService = TestBed.inject<ConfigService>(ConfigService);
            logger = TestBed.inject<CustomConfigLogger>(CustomConfigLogger);
        });

        it(`should output debug message when debug is 'true'`, (done: DoneFn) => {
            configService.ensureInitialized().subscribe(() => {
                void expect(logger.messages.length > 0).toBeTruthy();
                done();
            });
        });
    });

    describe('ensureInitialized', () => {
        let configService: ConfigService;

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

            configService = TestBed.inject<ConfigService>(ConfigService);
        });

        it("should return 'true'", (done: DoneFn) => {
            configService.ensureInitialized().subscribe((activated) => {
                void expect(activated).toBe(true);
                done();
            });
        });

        it('should return cached activated value when calling multiple times', (done: DoneFn) => {
            configService.ensureInitialized().subscribe(() => {
                configService.ensureInitialized().subscribe((activated) => {
                    void expect(activated).toBe(true);
                    done();
                });
            });
        });
    });

    describe('reload', () => {
        let configService: ConfigService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: CONFIG_PROVIDER,
                        useClass: TestConfigProvider,
                        multi: true
                    },
                    {
                        provide: CONFIG_OPTIONS,
                        useValue: {
                            debug: true
                        } as ConfigOptions
                    }
                ]
            });

            configService = TestBed.inject<ConfigService>(ConfigService);
        });

        it('should return fresh config', (done: DoneFn) => {
            configService.ensureInitialized().subscribe(() => {
                const c1 = configService.getValue('str');

                configService.reload().subscribe(() => {
                    const c2 = configService.getValue('str');

                    void expect(c1 !== c2).toBeTruthy();
                    done();
                });
            });
        });

        it('should throw an error when provider throws one', (done: DoneFn) => {
            for (let i = 0; i < 10; i++) {
                configService.reload();
            }

            configService.ensureInitialized().subscribe({
                error: (error: Error): void => {
                    void expect(of(error)).toBeTruthy();
                    done();
                }
            });
        });
    });

    describe('getValue', () => {
        let configService: ConfigService;

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

            configService = TestBed.inject<ConfigService>(ConfigService);
        });

        it('should get config string value', (done: DoneFn) => {
            configService.ensureInitialized().subscribe(() => {
                void expect(configService.getValue('name')).toBe('ng-config');
                done();
            });
        });

        it('should get config object value', (done: DoneFn) => {
            configService.ensureInitialized().subscribe(() => {
                void expect(configService.getValue('root')).toEqual({
                    key1: 'value1',
                    key2: true,
                    key3: 1
                });
                done();
            });
        });

        it(`should get with ':' key separator`, (done: DoneFn) => {
            configService.ensureInitialized().subscribe(() => {
                void expect(configService.getValue('root:key1')).toBe('value1');
                done();
            });
        });

        it('should return null if not found', (done: DoneFn) => {
            configService.ensureInitialized().subscribe(() => {
                void expect(configService.getValue('unknownKey') === null).toBeTruthy();
                done();
            });
        });
    });

    describe('mapType', () => {
        let configService: ConfigService;

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

            configService = TestBed.inject<ConfigService>(ConfigService);
        });

        it('should return mapped options', (done: DoneFn) => {
            configService.ensureInitialized().subscribe(() => {
                const expectedOptions = new TransientOptions();
                Object.assign(expectedOptions, {
                    str1: 'value1',
                    str2: 'true',
                    str3: '10',
                    str4: null,

                    num1: 100,
                    num2: 100.05,
                    num3: null,
                    num4: 0,

                    bool1: true,
                    bool2: true,
                    bool3: true,
                    bool4: true,
                    bool5: true,
                    bool6: null,
                    bool7: false,

                    arr1: ['item1', 'item2'],
                    arr2: ['item1', 'item2'],
                    arr3: null,
                    arr4: [],
                    arr5: [],

                    child: {
                        key1: 'hello',
                        key2: false,
                        key3: -10,
                        key4: ['sub1', 'sub2'],
                        key5: 'world'
                    },

                    child2: {
                        key1: '',
                        key2: true
                    }
                });

                void expect(configService.mapType(TransientOptions)).toEqual(expectedOptions);
                done();
            });
        });

        it(`should return new instances with 'TransientOptions'`, (done: DoneFn) => {
            configService.ensureInitialized().subscribe(() => {
                const options1 = configService.mapType(TransientOptions);
                const options2 = configService.mapType(TransientOptions);

                void expect(options1 !== options2).toBeTruthy();
                done();
            });
        });

        it(`should return same instance with 'RootOptions'`, (done: DoneFn) => {
            configService.ensureInitialized().subscribe(() => {
                const options1 = configService.mapType(RootOptions);
                const options2 = configService.mapType(RootOptions);

                void expect(options1 === options2).toBeTruthy();
                done();
            });
        });

        it(`should return default instance when no config section found`, (done: DoneFn) => {
            configService.ensureInitialized().subscribe(() => {
                const expectedOptions = new NotMapped();
                void expect(configService.mapType(NotMapped)).toEqual(expectedOptions);
                done();
            });
        });
    });

    describe('mapObject', () => {
        let configService: ConfigService;

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

            configService = TestBed.inject<ConfigService>(ConfigService);
        });

        it('should map to options object', (done: DoneFn) => {
            configService.ensureInitialized().subscribe(() => {
                const options = new TransientOptions();

                const expectedOptions = new TransientOptions();
                Object.assign(expectedOptions, {
                    str1: 'value1',
                    str2: 'true',
                    str3: '10',
                    str4: null,

                    num1: 100,
                    num2: 100.05,
                    num3: null,
                    num4: 0,

                    bool1: true,
                    bool2: true,
                    bool3: true,
                    bool4: true,
                    bool5: true,
                    bool6: null,
                    bool7: false,

                    arr1: ['item1', 'item2'],
                    arr2: ['item1', 'item2'],
                    arr3: null,
                    arr4: [],
                    arr5: [],

                    child: {
                        key1: 'hello',
                        key2: false,
                        key3: -10,
                        key4: ['sub1', 'sub2'],
                        key5: 'world'
                    },

                    child2: {
                        key1: '',
                        key2: true
                    }
                });

                void expect(configService.mapObject('transient', options)).toEqual(expectedOptions);
                done();
            });
        });

        it(`should return default instance when no config section found`, (done: DoneFn) => {
            configService.ensureInitialized().subscribe(() => {
                const options = new NotMapped();

                const expectedOptions = new NotMapped();
                void expect(configService.mapObject('nomap', options)).toEqual(expectedOptions);
                done();
            });
        });
    });

    describe('valueChanges', () => {
        let configService: ConfigService;

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

            configService = TestBed.inject<ConfigService>(ConfigService);
        });

        it('should emit valueChanges event', (done: DoneFn) => {
            const lastChangeInfo = {
                changeCount: 0,
                lastNum: 0
            };

            configService.valueChanges.subscribe(() => {
                ++lastChangeInfo.changeCount;
                lastChangeInfo.lastNum = configService.getValue('lastNum') as number;
            });

            configService.ensureInitialized().subscribe(() => {
                configService.reload().subscribe(() => {
                    configService.reload().subscribe(() => {
                        configService.reload().subscribe(() => {
                            configService.reload().subscribe(() => {
                                configService.reload().subscribe(() => {
                                    configService.reload().subscribe(() => {
                                        configService.reload().subscribe(() => {
                                            configService.reload().subscribe(() => {
                                                configService.reload().subscribe(() => {
                                                    const expectedObj = {
                                                        changeCount: 8,
                                                        lastNum: 9
                                                    };
                                                    void expect(lastChangeInfo).toEqual(expectedObj);
                                                    done();
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
