// eslint-disable-next-line max-classes-per-file
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Observable, forkJoin, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { CONFIG_OPTIONS, CONFIG_PROVIDER, ConfigOptions, ConfigProvider, ConfigSection, ConfigService } from '../src';

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
    // date = new Date();
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

describe('ConfigService', () => {
    describe('load', () => {
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

        it('should return merged config', (done: DoneFn) => {
            configService.load().subscribe((config) => {
                void expect(config.name).toBe('ng-config');
                done();
            });
        });

        it('should return cached config whenever load() is called', (done: DoneFn) => {
            configService.load();
            configService.load();
            configService.load();
            configService.load().subscribe((c1) => {
                configService.load().subscribe((c2) => {
                    void expect(c1).toEqual(c2);
                    done();
                });
            });
        });

        it("should reload the config when passing 'reLoad' = 'true'", (done: DoneFn) => {
            configService.load().subscribe((c1) => {
                configService.load(true).subscribe((c2) => {
                    void expect(c1.str !== c2.str).toBeTruthy();
                    done();
                });
            });
        });

        it('should throw an error message when provider throws error', (done: DoneFn) => {
            for (let i = 0; i < 10; i++) {
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
            configService.load().subscribe(() => {
                void expect(configService.getValue('name')).toBe('ng-config');
                done();
            });
        });

        it('should get config object value', (done: DoneFn) => {
            configService.load().subscribe(() => {
                void expect(configService.getValue('root')).toEqual({
                    key1: 'value1',
                    key2: true,
                    key3: 1
                });
                done();
            });
        });

        it(`should get with ':' key separator`, (done: DoneFn) => {
            configService.load().subscribe(() => {
                void expect(configService.getValue('root:key1')).toBe('value1');
                done();
            });
        });

        it('should return null if not found', (done: DoneFn) => {
            configService.load().subscribe(() => {
                void expect(configService.getValue('unknownKey') === null).toBeTruthy();
                done();
            });
        });
    });

    describe('map', () => {
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
            configService.load().subscribe(() => {
                const expectedOptions: TransientOptions = new TransientOptions();
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

                void expect(configService.map(TransientOptions)).toEqual(expectedOptions);
                done();
            });
        });

        it(`should return new instances with 'TransientOptions'`, (done: DoneFn) => {
            configService.load().subscribe(() => {
                const options1 = configService.map(TransientOptions);
                const options2 = configService.map(TransientOptions);

                void expect(options1 !== options2).toBeTruthy();
                done();
            });
        });

        it(`should return same instance with 'RootOptions'`, (done: DoneFn) => {
            configService.load().subscribe(() => {
                const options1 = configService.map(RootOptions);
                const options2 = configService.map(RootOptions);

                void expect(options1 === options2).toBeTruthy();
                done();
            });
        });

        it(`should return default instance when no config section found`, (done: DoneFn) => {
            configService.load().subscribe(() => {
                const expectedOptions = new NotMapped();
                void expect(configService.map(NotMapped)).toEqual(expectedOptions);
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
                    },
                    {
                        provide: CONFIG_OPTIONS,
                        useValue: {
                            trace: true
                        } as ConfigOptions
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

            configService.valueChanges.subscribe((config) => {
                ++lastChangeInfo.changeCount;
                lastChangeInfo.lastNum = config.lastNum as number;
            });

            configService.load().subscribe(() => {
                forkJoin([
                    configService.load(true),
                    configService.load(true),
                    configService.load(true),
                    configService.load(true),
                    configService.load(true),
                    configService.load(true),
                    configService.load(true),
                    configService.load(true),
                    configService.load(true)
                ]).subscribe(() => {
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
