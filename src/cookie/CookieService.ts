import { ICookieOptions, ICookieService } from '@ts-core/frontend';
import * as _ from 'lodash';
import * as Cookie from 'ngx-cookie';
import { CookieOptionsProvider, CookieWriterService } from 'ngx-cookie';
import { CookieOptions } from './CookieOptions';

export class CookieService extends Cookie.CookieService implements ICookieService {
    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(options: CookieOptions, document: Document) {
        super(document, { options } as CookieOptionsProvider, new CookieWriterService(document));
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public has(key: string): boolean {
        return !_.isNil(this.get(key));
    }

    public get<T = string>(key: string, defaultValue?: T): T {
        return this.has(key) ? (super.get(key) as T) : defaultValue;
    }

    public getObject<T = any>(key: string, defaultValue?: T): T {
        return this.has(key) ? (super.getObject(key) as T) : defaultValue;
    }

    public put<T = string>(key: string, value: T, options?: CookieOptions): void {
        super.put(key, value as string, options);
    }

    public putObject<T = any>(key: string, value: T, options?: CookieOptions): void {
        super.putObject(key, value as object, options);
    }

    public update(key: string, value: string, options?: ICookieOptions): void {
        this.put(key, value, options);
    }

    public updateObject(key: string, value: Object, options?: ICookieOptions): void {
        this.putObject(key, value, options);
    }
}
