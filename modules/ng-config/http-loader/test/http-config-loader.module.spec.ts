// tslint:disable: no-floating-promises

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InjectionToken } from '@angular/core';

import { TestBed } from '@angular/core/testing';

import { CONFIG_LOADER } from '../../src';

import { HttpConfigLoader } from '../src/http-config-loader';
import { HttpConfigLoaderModule } from '../src/http-config-loader.module';

describe('HttpConfigLoaderModule', () => {
    it("should provide 'HttpConfigLoader'", () => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                HttpConfigLoaderModule
            ]
        });

        const configLoaders = TestBed.get<HttpConfigLoader[]>(CONFIG_LOADER);
        expect(configLoaders).toBeDefined();
        expect((configLoaders as HttpConfigLoader[]).length).toBe(1);
        expect((configLoaders as HttpConfigLoader[])[0] instanceof HttpConfigLoader).toBeTruthy();
    });

    describe('withOptions', () => {
        it("should work with string 'endpoint' value", () => {
            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                    HttpConfigLoaderModule.withOptions({
                        endpoint: '/testsettings.json'
                    })
                ]
            });

            const configLoaders = TestBed.get<HttpConfigLoader[]>(CONFIG_LOADER) as HttpConfigLoader[];
            const configLoader = configLoaders[0];
            expect(configLoader.endpoint).toBe('/testsettings.json');
        });

        it("should work with injection token 'endpoint' value", () => {
            const ENDPOINT_URL = new InjectionToken<string>('ENDPOINT_URL');

            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                    HttpConfigLoaderModule.withOptions({
                        endpoint: ENDPOINT_URL
                    })
                ],
                providers: [
                    {
                        provide: ENDPOINT_URL,
                        useValue: '/testsettings.json'
                    }
                ]
            });

            const configLoaders = TestBed.get<HttpConfigLoader[]>(CONFIG_LOADER) as HttpConfigLoader[];
            const configLoader = configLoaders[0];
            expect(configLoader.endpoint).toBe('/testsettings.json');
        });
    });
});
