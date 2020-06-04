import { InjectionToken } from '@angular/core';

/**
 * Options for `ConfigService`.
 */
export interface ConfigOptions {
    /**
     * Set true to log debug information.
     */
    trace?: boolean;
    /**
     * Options suffix for options class. Default is 'Options'.
     */
    optionsSuffix?: string;
}

export const CONFIG_OPTIONS = new InjectionToken<ConfigOptions>('ConfigOptions');
