import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CustomConfigLogger {
    debug(message: string, data: { [key: string]: unknown }): void {
        let msg = message;
        if (data) {
            msg += `, data: ${JSON.stringify(data)}`;
        }

        // eslint-disable-next-line no-console
        console.log(msg);
    }
}
