// tslint:disable:no-any

import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ConfigLoader } from './config-loader';

export interface ConfigStaticData {
    [key: string]: any;
}

export const CONFIG_STATIC_DATA = new InjectionToken<ConfigStaticData>('ConfigStaticData');

// tslint:disable-next-line:no-unsafe-any
@Injectable({
    providedIn: 'root'
})
export class ConfigStaticLoader implements ConfigLoader {
    readonly settings: ConfigStaticData = {};

    constructor(@Optional() @Inject(CONFIG_STATIC_DATA) settings?: ConfigStaticData) {
        if (settings) {
            this.settings = settings;
        }
    }

    get async(): boolean {
        return false;
    }

    get source(): string {
        return 'StaticLoader';
    }

    load(): Observable<{ [key: string]: any }> {
        return of(this.settings);
    }
}
