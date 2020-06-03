// tslint:disable: no-floating-promises

import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { CONFIG_OPTIONS, CONFIG_PROVIDER, ConfigProvider, ConfigSection, ConfigService } from '../src';

@Injectable({
    providedIn: 'any'
})
export class TestConfigProvider implements ConfigProvider {
    private readonly config = {
        name: 'ng-config',
        counter: '0',
        obj: {
            key1: 'value1',
            key2: 'value2'
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
        it('should return merged config', (done: DoneFn) => {
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

        it("should return cached config if 'reLoad' is 'false'", (done: DoneFn) => {
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

            configService.load(false).subscribe((c1) => {
                void expect(c1.counter).toBe('1');
                done();
            });
        });

        it("should reload the config if 'reLoad' is 'true'", (done: DoneFn) => {
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
                configService.load(true);
            }

            configService.load().subscribe((config) => {
                void expect(config.counter).toBe('5');
                done();
            });
        });

        it('should throw an error message when provider throws error', (done: DoneFn) => {
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
        it('should get string value', (done: DoneFn) => {
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

        it('should get config section object value', (done: DoneFn) => {
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
                void expect(configService.getValue('obj')).toEqual({
                    key1: 'value1',
                    key2: 'value2'
                });
                done();
            });
        });

        it(`should get with dot '.' key separator`, (done: DoneFn) => {
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

        it(`should get with colon ':' key separator`, (done: DoneFn) => {
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
                void expect(configService.getValue('obj:key1')).toBe('value1');
                done();
            });
        });
    });
});
