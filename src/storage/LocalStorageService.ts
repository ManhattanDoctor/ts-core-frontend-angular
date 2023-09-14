import { DestroyableContainer } from '@ts-core/common';
import { NativeWindowService } from '@ts-core/frontend';
import * as _ from 'lodash';

export class LocalStorageService extends DestroyableContainer {
    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(private nativeWindow: NativeWindowService) {
        super();
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public get(key: string, defaultValue?: string): string {
        return this.has(key) ? this.storage.getItem(key) : defaultValue;
    }

    public has(key: string): boolean {
        return !_.isNil(this.storage.getItem(key));
    }

    public set(key: string, value: string): void {
        if (!_.isNil(value)) {
            this.storage.setItem(key, value);
        } else {
            this.remove(key);
        }
    }

    public remove(key: string): void {
        this.storage.removeItem(key);
    }

    public clear(): void {
        this.storage.clear();
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.nativeWindow = null;
    }

    //--------------------------------------------------------------------------
    //
    // 	Protected Properties
    //
    //--------------------------------------------------------------------------

    protected get length(): number {
        return this.storage.length;
    }

    protected get storage(): Storage {
        return this.nativeWindow.window.localStorage;
    }
}
