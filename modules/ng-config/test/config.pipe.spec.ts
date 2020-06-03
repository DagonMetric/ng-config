// tslint:disable: no-floating-promises

import { Injectable } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { ConfigProvider } from '../src/config-provider';
import { CONFIG_PROVIDER } from '../src/config-provider-token';
import { ConfigSection } from '../src';
import { ConfigPipe } from '../src/config.pipe';
import { ConfigService } from '../src/config.service';

@Injectable({
    providedIn: 'any'
})
export class TestConfigProvider implements ConfigProvider {
    private readonly config = {
        name: 'ng-config',
        obj: {
            key1: 'value1',
            key2: 'value2'
        }
    };

    get name(): string {
        return 'TestConfigLoader';
    }

    load(): Observable<ConfigSection> {
        return of(this.config).pipe(delay(10));
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
});
