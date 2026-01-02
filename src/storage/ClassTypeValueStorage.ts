import { ClassType, TransformUtil } from '@ts-core/common';
import { JSONValueStorage } from './JSONValueStorage';
import { LocalStorageService } from './LocalStorageService';
import { CookieService } from '../cookie/CookieService';
import * as _ from 'lodash';

export class ClassTypeValueStorage<T> extends JSONValueStorage<T> {
    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(
        name: string,
        protected classType: ClassType<T>,
        storage: LocalStorageService,
        cookies: CookieService
    ) {
        super(name, storage, cookies);
    }
    //--------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    //--------------------------------------------------------------------------

    protected serialize(value: string): T {
        return TransformUtil.toClass(this.classType, super.serialize(value));
    }

    protected deserialize(value: T): string {
        return super.deserialize(TransformUtil.fromClass(value));
    }
}
