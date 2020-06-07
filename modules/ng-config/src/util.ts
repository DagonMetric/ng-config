import { ConfigSection, ConfigValue } from './config-value';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function mapOptionValues(options: ConfigSection, configSection: ConfigSection): void {
    const keys = Object.keys(options);
    for (const key of keys) {
        if (!Object.prototype.hasOwnProperty.call(configSection, key)) {
            continue;
        }

        // const popDescriptor = Object.getOwnPropertyDescriptor(options, key);
        // if (!popDescriptor?.writable) {
        //     continue;
        // }

        const optionsValue = options[key];
        const configValue = configSection[key];

        if (configValue == null) {
            options[key] = null;
            continue;
        }

        if (optionsValue == null) {
            options[key] = configValue;
            continue;
        }

        if (optionsValue === configValue) {
            continue;
        }

        if (typeof optionsValue === 'string') {
            if (typeof configValue === 'string') {
                options[key] = configValue;
            } else {
                options[key] = JSON.stringify(configValue);
            }
        } else if (typeof optionsValue === 'boolean') {
            if (typeof configValue === 'boolean') {
                options[key] = configValue;
            } else if (typeof configValue === 'string') {
                options[key] = ['true', '1', 'on', 'yes'].indexOf(configValue.toLowerCase()) > -1;
            } else if (typeof configValue === 'number') {
                options[key] = configValue === 1;
            } else {
                options[key] = false;
            }
        } else if (typeof optionsValue === 'number') {
            options[key] = Number(configValue) || 0;
        } else if (Array.isArray(optionsValue)) {
            if (Array.isArray(configValue)) {
                if (
                    configValue.length > 0 &&
                    configValue.filter((v) => typeof v == 'string').length === configValue.length
                ) {
                    options[key] = [...configValue];
                } else {
                    options[key] = [];
                }
            } else if (typeof configValue === 'string') {
                options[key] = configValue
                    .split(';')
                    .map((s) => s.trim())
                    .filter((s) => s.length > 0);
            }
        } else if (
            typeof optionsValue === 'object' &&
            Object.prototype.toString.call(optionsValue) !== '[object Date]'
        ) {
            if (!Array.isArray(configValue) && typeof configValue === 'object') {
                mapOptionValues(optionsValue, configValue);
            }
        }
    }
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function equalDeep(a: ConfigValue, b: ConfigValue): boolean {
    if (a === null && b === null) {
        return true;
    }

    if (Array.isArray(a)) {
        if (!b || !Array.isArray(b)) {
            return false;
        }

        if (a.length !== b.length) {
            return false;
        }

        for (let i = a.length - 1; i >= 0; i--) {
            if (!equalDeep(a[i], b[i])) {
                return false;
            }
        }

        return true;
    }

    if (Array.isArray(b)) {
        return false;
    }

    if (a && b && typeof a == 'object' && typeof b == 'object') {
        const keys = Object.keys(a);
        if (keys.length !== Object.keys(b).length) {
            return false;
        }

        for (const key of keys) {
            if (!equalDeep(a[key], b[key])) {
                return false;
            }
        }

        return true;
    }

    return a === b;
}
