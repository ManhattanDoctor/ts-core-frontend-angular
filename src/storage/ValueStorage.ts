import { DestroyableContainer } from '@ts-core/common';
import { CookieService } from '../cookie/CookieService';
import { LocalStorageService } from '../storage/LocalStorageService';
import { IValueStorage } from './IValueStorage';
import * as _ from 'lodash';

export class ValueStorage<T = string> extends DestroyableContainer implements IValueStorage<T> {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    protected _name: string;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(name: string, protected storage: LocalStorageService, protected cookies: CookieService) {
        super();
        this._name = name;
    }

    //--------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    //--------------------------------------------------------------------------

    protected serialize(value: string): T {
        return value as T;
    }

    protected deserialize(value: T): string {
        return value as string;
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public get(defaultValue?: T): T {
        let item = null;
        if (this.storage.has(this.name)) {
            item = this.storage.get(this.name);
        } else if (this.cookies.has(this.name)) {
            item = this.cookies.get(this.name);
        }
        return !_.isNil(item) ? this.serialize(item) : defaultValue;
    }

    public has(): boolean {
        return this.storage.has(this.name) || this.cookies.has(this.name);
    }

    public set(value: T): T {
        let item = !_.isNil(value) ? this.deserialize(value) : null;
        this.cookies.put(this.name, item);
        this.storage.set(this.name, item);
        return value;
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.cookies = null;
        this.storage = null;
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get name(): string {
        return this._name;
    }
}
