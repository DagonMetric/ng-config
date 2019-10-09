// tslint:disable: no-floating-promises
import { inject, TestBed } from '@angular/core/testing';

import { StaticConfigLoader } from '../src/static-config-loader';
import { StaticConfigLoaderModule } from '../src/static-config-loader.module';

describe('StaticConfigLoader', () => {
    it('should be created', () => {
        TestBed.configureTestingModule({
            providers: [
                StaticConfigLoader
            ]
        });

        const configLoader = TestBed.get<StaticConfigLoader>(StaticConfigLoader);
        expect(configLoader).toBeDefined();
        expect(configLoader instanceof StaticConfigLoader).toBeTruthy();
        expect((configLoader as StaticConfigLoader).name).toBe('StaticConfigLoader');
    });

    describe('load', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    StaticConfigLoaderModule.withSettings({
                        name: 'ng-config',
                        obj: {
                            key1: 'value1',
                            key2: 'value2'
                        }
                    })
                ]
            });
        });

        it('should be able to load settings',
            inject([StaticConfigLoader], (configLoader: StaticConfigLoader) => {
                // tslint:disable-next-line: no-any
                configLoader.load().subscribe((data: { [key: string]: any }) => {
                    expect(data.name).toEqual('ng-config');
                });
            }));
    });
});
