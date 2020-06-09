import { Injectable } from '@angular/core';

/**
 * Optional custom logger for ng-config's debug information.
 */
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
