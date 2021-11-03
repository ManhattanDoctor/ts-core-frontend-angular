import { IDestroyable } from '@ts-core/common';

export abstract class IUser<T = any> implements IDestroyable {
    // --------------------------------------------------------------------------
    //
    // 	Constants
    //
    // --------------------------------------------------------------------------

    public id: UserUid;

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public abstract update(data: T): void;
    public abstract destroy(): void;
}

export type UserUid = string | number;
