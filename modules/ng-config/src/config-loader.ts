import { Observable } from 'rxjs';

export interface ConfigLoader {
    readonly source: string;
    readonly async: boolean;
    // tslint:disable-next-line:no-any
    load(): Observable<{ [key: string]: any }>;
}
