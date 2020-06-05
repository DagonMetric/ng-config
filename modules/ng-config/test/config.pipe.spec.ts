// tslint:disable: no-floating-promises

import { Injectable } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';

import { Observable, of } from 'rxjs';

import { CONFIG_PROVIDER, ConfigProvider } from '../src/config-provider';
import { ConfigPipe } from '../src/config.pipe';
import { ConfigService } from '../src/config.service';
import { ConfigSection } from '../src/config-value';

@Injectable({
    providedIn: 'any'
})
export class TestConfigProvider implements ConfigProvider {
    get name(): string {
        return 'TestConfigProvider';
    }

    load(): Observable<ConfigSection> {
        return of({
            name: 'ng-config',
            obj: {
                key1: 'value1',
                key2: 'value2'
            }
        });
    }
}

describe('ConfigPipe', () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [
                ConfigService,
                {
                    provide: CONFIG_PROVIDER,
                    useClass: TestConfigProvider,
                    multi: true
                }
            ]
        });

        const configService = TestBed.inject<ConfigService>(ConfigService);
        await configService.load().toPromise();
    });

    it('should be able to transform', inject([ConfigService], (configService: ConfigService) => {
        const pipe = new ConfigPipe(configService);

        void expect(pipe.transform('name')).toEqual('ng-config');
    }));

    it('should be able to transform with separator', inject([ConfigService], (configService: ConfigService) => {
        const pipe = new ConfigPipe(configService);

        void expect(pipe.transform('obj:key1')).toEqual('value1');
    }));
});
