import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'any'
})
export class AppOptions {
    name = '';
    lang = '';
    logEnabled = false;
    logLevel = 0;
    num = 0;
    arr = [];
    child = {
        key1: '',
        key2: true
    };
}
