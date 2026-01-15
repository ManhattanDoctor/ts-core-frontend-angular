import { Loadable } from '@ts-core/common';
import { LoginServiceBase } from '../login/LoginServiceBase';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs';

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
        this.login.logined.pipe(takeUntil(this.destroyed)).subscribe(() => this.loginedHandler());
        this.login.logouted.pipe(takeUntil(this.destroyed)).subscribe(() => this.logoutedHandler());
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
