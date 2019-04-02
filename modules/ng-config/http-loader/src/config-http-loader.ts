// tslint:disable:no-unsafe-any

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';

import { ConfigLoader } from '@dagonmetric/ng-config';

import { CONFIG_ENDPOINT_URL } from './config-endpoint-url';

@Injectable({
    providedIn: 'root'
})
export class ConfigHttpLoader implements ConfigLoader {
    private readonly _endpoint: string = '/appsettings.json';

    constructor(private readonly _httpClient: HttpClient,
        @Optional() @Inject(CONFIG_ENDPOINT_URL) endpoint: string) {
        if (endpoint) {
            this._endpoint = endpoint;
        }
    }

    get async(): boolean {
        return true;
    }

    get source(): string {
        return 'HttpLoader';
    }

    // tslint:disable-next-line:no-any
    load(): Observable<{ [key: string]: any }> {
        return this._httpClient.get(this._endpoint);
    }
}
