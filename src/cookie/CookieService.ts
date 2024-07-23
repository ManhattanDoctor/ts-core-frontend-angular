import { ICookieOptions, ICookieService } from '@ts-core/frontend';
import { CookieOptionsProvider } from 'ngx-cookie';
import { CookieOptions } from './CookieOptions';
import * as Cookie from 'ngx-cookie';
import * as _ from 'lodash';

export class CookieService extends Cookie.CookieService implements ICookieService {
    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(document: Document, options: CookieOptions, isPlatformBrowser: boolean) {
        super(document, { options } as CookieOptionsProvider, new CookieWriterService(document, isPlatformBrowser));
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public has(key: string): boolean {
        return !_.isNil(super.get(key));
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

class CookieWriterService extends Cookie.CookieWriterService {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    private isPlatformBrowser: boolean;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(document: Document, isPlatformBrowser: boolean) {
        super(document);
        this.isPlatformBrowser = isPlatformBrowser;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public readAllAsString(): string {
        return this.isPlatformBrowser ? super.readAllAsString() : '';
    }

    public write(name: string, value: string | undefined, options?: CookieOptions): void {
        if (this.isPlatformBrowser) {
            super.write(name, value, options);
        }
    }
}
