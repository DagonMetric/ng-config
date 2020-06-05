import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InjectionToken } from '@angular/core';

import { TestBed } from '@angular/core/testing';

import { CONFIG_PROVIDER } from '../../src';

import { HttpConfigProvider } from '../src/http-config-provider';
import { HttpConfigProviderModule } from '../src/http-config-provider.module';

describe('HttpConfigProviderModule', () => {
    describe('withOptions', () => {
        it("should work with string 'endpoint' value", () => {
            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                    HttpConfigProviderModule.withOptions({
                        endpoint: '/testsettings.json'
                    })
                ]
            });

            const configProviders = TestBed.inject<HttpConfigProvider[]>(CONFIG_PROVIDER);
            const configProvider = configProviders[0];

            void expect(configProvider.endpoint).toBe('/testsettings.json');
        });

        it("should work with injection token 'endpoint' value", () => {
            const ENDPOINT_URL = new InjectionToken<string>('ENDPOINT_URL');

            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                    HttpConfigProviderModule.withOptions({
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

            const configProviders = TestBed.inject<HttpConfigProvider[]>(CONFIG_PROVIDER);
            const configProvider = configProviders[0];

            void expect(configProvider.endpoint).toBe('/testsettings.json');
        });
    });
});
