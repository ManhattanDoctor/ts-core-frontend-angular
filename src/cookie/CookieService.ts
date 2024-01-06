import { ICookieOptions, ICookieService } from '@ts-core/frontend';
import * as _ from 'lodash';
import * as Cookie from 'ngx-cookie';
import { CookieOptionsProvider } from 'ngx-cookie';
import { PlatformService } from '../service/PlatformService';
import { CookieOptions } from './CookieOptions';

export class CookieService extends Cookie.CookieService implements ICookieService {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    private _document: Document;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(options: CookieOptions, platform: PlatformService, item?: Document) {
        super({ options } as CookieOptionsProvider);
        this._document = !_.isNil(item) ? item : document;

        let cookieString = '';
        Object.defineProperty(this, 'cookieString', {
            get: (): string => {
                return platform.isPlatformBrowser ? this.document.cookie : cookieString;
            },
            set: (value: string) => {
                if (platform.isPlatformBrowser) {
                    this.document.cookie = value;
                } else {
                    cookieString = value;
                }
            },
            enumerable: true,
            configurable: true
        });
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
        return this.has(key as any) ? (super.get(key) as any) : defaultValue;
    }

    public getObject<T = any>(key: string, defaultValue?: T): T {
        return this.has(key) ? (super.getObject(key) as any) : defaultValue;
    }

    public put<T = string>(key: string, value: T, options?: CookieOptions): void {
        if (!_.isNil(value)) {
            super.put(key, value as any, options);
        } else {
            super.remove(key);
        }
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

    // --------------------------------------------------------------------------
    //
    //  Private Properties
    //
    // --------------------------------------------------------------------------

    private get document(): Document {
        return this._document;
    }
}
