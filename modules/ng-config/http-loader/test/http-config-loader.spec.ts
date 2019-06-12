// tslint:disable: no-floating-promises

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { inject, TestBed } from '@angular/core/testing';

import { JsonObject } from '../../src';

import { HttpConfigLoader } from '../src/http-config-loader';

describe('HttpConfigLoader', () => {
    it('should be created', () => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                HttpConfigLoader
            ]
        });

        const configLoader = TestBed.get<HttpConfigLoader>(HttpConfigLoader);
        expect(configLoader).toBeDefined();
        expect(configLoader instanceof HttpConfigLoader).toBeTruthy();
        expect((configLoader as HttpConfigLoader).name).toBe('HttpConfigLoader');
    });

    describe('load', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    HttpClientTestingModule,
                ],
                providers: [
                    HttpConfigLoader
                ]
            });
        });

        it('should be able to load settings',
            inject([HttpTestingController, HttpConfigLoader], (httpMock: HttpTestingController, configLoader: HttpConfigLoader) => {

                const mockSettings = {
                    name: 'ng-config',
                    obj: {
                        key1: 'value1',
                        key2: 'value2'
                    }
                };

                configLoader.load().subscribe((data: JsonObject) => {
                    expect(data).toEqual(mockSettings);
                    expect(data.name).toEqual('ng-config');
                });

                const req = httpMock.expectOne(configLoader.endpoint);
                expect(req.cancelled).toBeFalsy();
                expect(req.request.method).toBe('GET');
                expect(req.request.responseType).toEqual('json');
                req.flush(mockSettings);
                httpMock.verify();
            }));
    });
});
