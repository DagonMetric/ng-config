import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TestBed, inject } from '@angular/core/testing';

import { HttpConfigProvider } from '../src/http-config-provider';
import { ConfigSection } from 'modules/ng-config/src';

describe('HttpConfigProvider', () => {
    it('should be created', () => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [HttpConfigProvider]
        });

        const configLoader = TestBed.inject<HttpConfigProvider>(HttpConfigProvider);
        void expect(configLoader).toBeDefined();
    });

    describe('load', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule],
                providers: [HttpConfigProvider]
            });
        });

        it('should be able to load settings', inject(
            [HttpTestingController, HttpConfigProvider],
            (httpMock: HttpTestingController, configLoader: HttpConfigProvider) => {
                const mockSettings = {
                    name: 'ng-config',
                    obj: {
                        key1: 'value1',
                        key2: 'value2'
                    }
                };

                configLoader.load().subscribe((data: ConfigSection) => {
                    void expect(data).toEqual(mockSettings);
                    void expect(data.name).toEqual('ng-config');
                });

                const req = httpMock.expectOne(configLoader.endpoint);
                void expect(req.cancelled).toBeFalsy();
                void expect(req.request.method).toBe('GET');
                void expect(req.request.responseType).toEqual('json');
                req.flush(mockSettings);
                httpMock.verify();
            }
        ));
    });
});
