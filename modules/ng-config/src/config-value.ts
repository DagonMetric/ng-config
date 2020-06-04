export type ConfigValueBasic = string | string[] | number | boolean;

export interface ConfigSection {
    [key: string]: ConfigValueBasic | ConfigSection | null;
}

export type ConfigValue = ConfigValueBasic | ConfigSection | null;
