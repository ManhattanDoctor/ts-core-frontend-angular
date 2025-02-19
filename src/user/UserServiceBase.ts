import { ObservableData } from '@ts-core/common';
import { Observable, filter, map } from 'rxjs';
import { LoginServiceBase } from '../login/LoginServiceBase';
import { IUser, UserUid } from './IUser';
import { Loginable } from '../login/Loginable';
import * as _ from 'lodash';

export abstract class UserServiceBase<U extends IUser = any, V = void, T extends LoginServiceBase = LoginServiceBase> extends Loginable<
    T,
    V | UserServiceBaseEvent,
    U | Partial<U>
> {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    protected _user: U;

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async initializeUser(data: any): Promise<void> {
        this._user = this.createUser(data);
    }

    protected async deinitializeUser(): Promise<void> {
        this._user = null;
    }

    protected async loginedHandler(): Promise<void> {
        await this.initializeUser(this.login.loginData);
        this.observer.next(new ObservableData(UserServiceBaseEvent.LOGINED, this.user));
    }

    protected async logoutedHandler(): Promise<void> {
        await this.deinitializeUser();
        this.observer.next(new ObservableData(UserServiceBaseEvent.LOGOUTED));
    }

    protected abstract createUser(data: any): U;

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public isUser(item: Partial<U> | UserUid): boolean {
        if (!this.has || _.isNil(item)) {
            return false;
        }
        if (_.isString(item) || _.isNumber(item)) {
            return item === this.user.id;
        }
        return item.id === this.user.id;
    }

    public update(data: any): void {
        if (!this.has) {
            return;
        }
        this.user.update(data);
        this.observer.next(new ObservableData(UserServiceBaseEvent.CHANGED, data));
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        if (!_.isNil(this.observer)) {
            this.observer.complete();
            this.observer = null;
        }
        this._user = null;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get id(): UserUid {
        return this.has ? this.user.id : null;
    }

    public get has(): boolean {
        return !_.isNil(this._user);
    }

    public get user(): U {
        return this._user;
    }

    public get isLogined(): boolean {
        return this.has;
    }

    public get logined(): Observable<U> {
        return this.events.pipe(
            filter(item => item.type === UserServiceBaseEvent.LOGINED),
            map(item => item.data as U)
        );
    }

    public get changed(): Observable<Partial<U>> {
        return this.events.pipe(
            filter(item => item.type === UserServiceBaseEvent.CHANGED),
            map(item => item.data as Partial<U>)
        );
    }

    public get logouted(): Observable<void> {
        return this.events.pipe(
            filter(item => item.type === UserServiceBaseEvent.LOGOUTED),
            map(() => null)
        );
    }
}

export enum UserServiceBaseEvent {
    LOGINED = 'LOGINED',
    CHANGED = 'CHANGED',
    LOGOUTED = 'LOGOUTED'
}
