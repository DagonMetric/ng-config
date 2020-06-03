import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TestBed, inject } from '@angular/core/testing';

import { ConfigSection } from 'modules/ng-config/src';

import { HttpConfigProvider } from '../src/http-config-provider';
import { HTTP_CONFIG_PROVIDER_OPTIONS, HttpConfigProviderOptions } from '../src/http-config-provider-options';

describe('HttpConfigProvider', () => {
    describe('load', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule],
                providers: [
                    {
                        provide: HTTP_CONFIG_PROVIDER_OPTIONS,
                        useValue: {
                            endpoint: '/appsettings.json'
                        } as HttpConfigProviderOptions
                    },
                    HttpConfigProvider
                ]
            });
        });

        it('should be able to load config', inject(
            [HttpTestingController, HttpConfigProvider],
            (httpMock: HttpTestingController, configLoader: HttpConfigProvider) => {
                const mockConfig = {
                    name: 'ng-config',
                    obj: {
                        key1: 'value1',
                        key2: 'value2'
                    }
                };

                configLoader.load().subscribe((data: ConfigSection) => {
                    void expect(data).toEqual(mockConfig);
                });

                const req = httpMock.expectOne(configLoader.endpoint);
                void expect(req.cancelled).toBeFalsy();
                void expect(req.request.method).toBe('GET');
                void expect(req.request.responseType).toEqual('json');
                req.flush(mockConfig);
                httpMock.verify();
            }
        ));
    });
});
