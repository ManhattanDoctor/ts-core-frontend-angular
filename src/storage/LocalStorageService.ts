import { DestroyableContainer } from '@ts-core/common';
import * as _ from 'lodash';

export class LocalStorageService extends DestroyableContainer {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    protected storage: Storage;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(storage: Storage) {
        super();
        this.storage = storage;
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public get(key: string, defaultValue?: string): string {
        if (_.isNil(this.storage)) {
            return null;
        }
        return this.has(key) ? this.storage.getItem(key) : defaultValue;
    }

    public has(key: string): boolean {
        if (_.isNil(this.storage)) {
            return false;
        }
        return !_.isNil(this.storage.getItem(key));
    }

    public set(key: string, value: string): void {
        if (_.isNil(this.storage)) {
            return;
        }
        if (!_.isNil(value)) {
            this.storage.setItem(key, value);
        } else {
            this.remove(key);
        }
    }

    public remove(key: string): void {
        if (!_.isNil(this.storage)) {
            this.storage.removeItem(key);
        }
    }

    public clear(): void {
        if (!_.isNil(this.storage)) {
            this.storage.clear();
        }
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.storage = null;
    }

    //--------------------------------------------------------------------------
    //
    // 	Protected Properties
    //
    //--------------------------------------------------------------------------

    protected get length(): number {
        return this.storage.length;
    }
}
