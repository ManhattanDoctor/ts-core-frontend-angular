import { Loadable } from '@ts-core/common';
import { LoginServiceBase } from '../login/LoginServiceBase';
import * as _ from 'lodash';

export abstract class Loginable<T extends LoginServiceBase = LoginServiceBase, U = any, V = any> extends Loadable<U, V> {
    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(protected login: T) {
        super();
    }

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected initialize(): void {
        if (this.login.isLoggedIn) {
            this.loginedHandler();
        }
        this.login.logined.pipe().subscribe(() => this.loginedHandler());
        this.login.logouted.pipe().subscribe(() => this.logoutedHandler());
    }

    protected async loginedHandler(): Promise<void> {}

    protected async logoutedHandler(): Promise<void> {}

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.login = null;
    }
}
