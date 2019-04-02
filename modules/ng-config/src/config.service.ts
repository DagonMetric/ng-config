// tslint:disable:no-any
// tslint:disable:no-unsafe-any

import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, InjectionToken, Optional, PLATFORM_ID } from '@angular/core';

import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ConfigLoader } from './config-loader';
import { CONFIG_LOADER } from './config-loader-token';

export interface ConfigLoadingContext {
    data: { [key: string]: any };
    loading: boolean;
    loaded: boolean;
}

export const ENABLE_DEBUG_LOGGING = new InjectionToken<boolean>('EnableDebugLogging');

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    readonly loadEvent: Observable<ConfigLoadingContext>;

    private readonly _cachedSettings: { [key: string]: any } = {};
    private readonly _onLoad = new BehaviorSubject<ConfigLoadingContext>({ data: {}, loading: false, loaded: false });
    private readonly _isBrowser: boolean;
    private _loading = false;
    private _completed = false;
    private _syncCompleted = false;
    private _isMSIe: boolean | undefined;

    get loaderNames(): string[] {
        if (!this._configLoaders || !this._configLoaders.length) {
            return [];
        }

        return this._configLoaders.map(configLoader => configLoader.source);
    }

    constructor(@Inject(PLATFORM_ID) platformId: Object,
        @Optional() @Inject(CONFIG_LOADER) private readonly _configLoaders?: ConfigLoader[],
        @Optional() @Inject(ENABLE_DEBUG_LOGGING) private readonly _enableDebugLogging?: boolean) {
        this._isBrowser = isPlatformBrowser(platformId);
        this.loadEvent = this._onLoad.asObservable();

        this.loadSync(false);
    }

    async load(reLoad?: boolean): Promise<{ [key: string]: any }> {
        const shouldLoadAsync = this.loadSync(reLoad);
        if (!shouldLoadAsync) {
            return Promise.resolve(this._cachedSettings);
        }

        if (this._completed && !reLoad) {
            this.log('Configuration already loaded.');

            return Promise.resolve(this._cachedSettings);
        }

        if (!this._configLoaders || !this._configLoaders.length) {
            this._completed = true;
            this.log('No configuration loader available.');

            this._onLoad.next({
                data: this._cachedSettings,
                loading: false,
                loaded: true
            });

            return Promise.resolve(this._cachedSettings);
        }

        this.log('Cconfiguration async loading started.');

        if (!this._loading) {
            this._loading = true;

            this._onLoad.next({
                data: this._cachedSettings,
                loading: true,
                loaded: false
            });
        }

        const asyncLoaders = this._configLoaders.filter(configLoader => configLoader.async);

        return forkJoin(asyncLoaders.map(configLoader => configLoader.load()
            .pipe(
                tap(data => {
                    Object.assign(this._cachedSettings, data);
                    this.log(configLoader.source, data);
                })
            )))
            .pipe(
                tap(configs => {
                    configs.forEach(config => {
                        Object.assign(this._cachedSettings, config);
                    });

                    this._completed = true;
                    this._loading = false;

                    this.log('Configuration async loading completed.');

                    this._onLoad.next({
                        data: this._cachedSettings,
                        loading: false,
                        loaded: true
                    });
                })
            )
            .toPromise();
    }

    getSettings<T>(key: string, defaultValue?: T): T;

    getSettings(key?: string | string[], defaultValue?: any): any;

    getSettings(key?: string | string[], defaultValue?: any): any {
        if (!key || (Array.isArray(key) && !key[0])) {
            return this._cachedSettings;
        }

        const keyArray = Array.isArray(key) ? key : key.split(/\.|:/);

        let result = keyArray.reduce((acc: any, current: string) => acc && acc[current],
            this._cachedSettings);

        if (result === undefined) {
            result = defaultValue;
        }

        return result;
    }

    private loadSync(reLoad?: boolean): boolean {
        let shouldLoadAsync = false;

        if (this._completed && !reLoad) {
            this.log('Configuration already loaded.');

            return shouldLoadAsync;
        }

        if (!this._configLoaders || !this._configLoaders.length) {
            this._completed = true;

            this.log('No configuration loader available.');

            this._onLoad.next({
                data: this._cachedSettings,
                loading: false,
                loaded: true
            });

            return shouldLoadAsync;
        }

        shouldLoadAsync = this._configLoaders.filter(configLoader => configLoader.async).length > 0;
        const syncLoaders = this._configLoaders.filter(configLoader => !configLoader.async);

        if (this._syncCompleted && !reLoad) {
            return shouldLoadAsync;
        }

        if (!syncLoaders.length) {
            return shouldLoadAsync;
        }

        this.log('Configuration sync loading started.');

        if (!this._loading) {
            this._loading = true;

            this._onLoad.next({
                data: this._cachedSettings,
                loading: true,
                loaded: false
            });
        }

        forkJoin(syncLoaders.map(configLoader => configLoader.load()
            .pipe(
                tap(data => {
                    Object.assign(this._cachedSettings, data);
                    this.log(configLoader.source, data);
                })
            )))
            .subscribe(configs => {
                configs.forEach(config => {
                    Object.assign(this._cachedSettings, config);
                });

                this._syncCompleted = true;
                if (shouldLoadAsync) {
                    this.log('Configuration sync loading completed.');
                } else {
                    this._completed = true;
                    this._loading = false;

                    this.log('Configuration sync loading completed.');

                    this._onLoad.next({
                        data: this._cachedSettings,
                        loading: false,
                        loaded: true
                    });
                }
            });

        return shouldLoadAsync;
    }

    private log(msg: string, data?: any): void {
        if (!this._enableDebugLogging) {
            return;
        }

        if (data) {
            if (this._isBrowser && !this.isMSIE()) {
                // tslint:disable-next-line:no-console
                console.log(`[ConfigService] ${msg}, data: `, data);
            } else {
                // tslint:disable-next-line:no-console
                console.log(`[ConfigService] ${msg}, data: `, JSON.stringify(data));
            }

        } else {

            // tslint:disable-next-line:no-console
            console.log(`[ConfigService] ${msg}`);
        }
    }

    private isMSIE(): boolean {
        if (typeof this._isMSIe === 'boolean') {
            return this._isMSIe;
        }

        if (this._isBrowser && typeof document === 'object' && typeof window === 'object') {
            const ua = window.navigator.userAgent ? window.navigator.userAgent : '';
            if ((ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/'))) {
                this._isMSIe = true;
            } else {
                this._isMSIe = false;
            }
        } else {
            this._isMSIe = false;
        }

        return this._isMSIe;
    }
}
