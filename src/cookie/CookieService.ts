import { ICookieOptions, ICookieService } from '@ts-core/frontend/cookie';
import * as _ from 'lodash';
import * as Cookie from 'ngx-cookie';
import { CookieOptionsProvider } from 'ngx-cookie';
import { CookieOptions } from './CookieOptions';

export class CookieService extends Cookie.CookieService implements ICookieService {
    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(options?: CookieOptions) {
        options = _.assign(
            {
                path: '/',
                domain: null,
                expires: null,
                secure: false,
                httpOnly: false
            },
            options
        );
        super({ options } as CookieOptionsProvider);
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public has(key: string): boolean {
        return !_.isNil(super.get(key));
    }

    public get(key: string, defaultValue?: string): string {
        return this.has(key) ? super.get(key) : defaultValue;
    }

    public getObject<T = any>(key: string, defaultValue?: T): T {
        return this.has(key) ? (super.getObject(key) as any) : defaultValue;
    }

    public putObject<T = any>(key: string, value: T, options?: CookieOptions): void {
        super.putObject(key, value as any, options);
    }

    public update(key: string, value: string, options?: ICookieOptions): void {
        if (!_.isNil(value)) {
            this.put(key, value, options);
        } else {
            this.remove(key);
        }
    }

    public updateObject(key: string, value: Object, options?: ICookieOptions): void {
        if (!_.isNil(value)) {
            this.putObject(key, value, options);
        } else {
            this.remove(key);
        }
    }
}
