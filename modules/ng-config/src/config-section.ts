export interface ConfigSection {
    [key: string]: string | ConfigSection | null;
}
