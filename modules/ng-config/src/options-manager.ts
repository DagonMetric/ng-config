import { Injectable, Injector } from '@angular/core';

import { ConfigRoot } from './config-root';
import { ConfigSection } from './config-section';

export interface OptionsBase {
    [key: string]: string | number | boolean | OptionsBase | null;
}

export type NewableOptions<TOptions> = new () => TOptions;

const OptionsSuffix = 'Options';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function mapOptionValues(options: OptionsBase, configSection: ConfigSection): void {
    const keys = Object.keys(options);
    for (const key of keys) {
        if (!Object.prototype.hasOwnProperty.call(configSection, key)) {
            continue;
        }

        const optionsValue = options[key];
        const configValue = configSection[key];

        if (optionsValue === configValue) {
            continue;
        }

        if (configValue == null) {
            options[key] = null;
            continue;
        }

        if (optionsValue == null) {
            options[key] = configValue;
            continue;
        }

        if (typeof optionsValue === 'string') {
            if (typeof configValue === 'string') {
                options[key] = configValue;
            } else if (typeof configValue === 'number') {
                options[key] = (configValue as number).toString();
            } else if (typeof configValue === 'boolean') {
                options[key] = (configValue as boolean).toString();
            } else {
                options[key] = JSON.stringify(configValue);
            }
        } else if (typeof optionsValue === 'boolean') {
            if (typeof configValue === 'string') {
                options[key] = ['1', 'true', 'on'].indexOf(configValue.toLowerCase()) > -1;
            } else if (typeof configValue === 'boolean') {
                options[key] = configValue;
            } else if (typeof configValue === 'number') {
                options[key] = configValue === 1;
            } else {
                options[key] = false;
            }
        } else if (typeof optionsValue === 'number') {
            options[key] = Number(configValue) || 0;
        } else if (typeof optionsValue === 'object' && typeof configValue === 'object') {
            mapOptionValues(optionsValue, configValue);
        }
    }
}

@Injectable({
    providedIn: 'root'
})
export class OptionsManager {
    constructor(private readonly configRoot: ConfigRoot, private readonly injector: Injector) {}

    getValue<T extends NewableOptions<T>>(optionsClass: NewableOptions<T>): T {
        const normalizedKey = this.getNormalizedKey(optionsClass);
        const configSection = this.configRoot.getSection(normalizedKey);
        let optionsObj = this.injector.get<T>(optionsClass);
        optionsObj = optionsObj || new optionsClass();
        if (configSection == null) {
            return optionsObj;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mapOptionValues(optionsObj as any, configSection);

        return optionsObj;
    }

    private getNormalizedKey<T extends NewableOptions<T>>(optionsClass: NewableOptions<T>): string {
        let normalizedKey = optionsClass.name;
        if (normalizedKey.length > OptionsSuffix.length && normalizedKey.endsWith(OptionsSuffix)) {
            normalizedKey = normalizedKey.substr(0, normalizedKey.length - OptionsSuffix.length);
        }

        normalizedKey = normalizedKey[0].toLowerCase() + normalizedKey.substr(1);

        return normalizedKey;
    }
}
