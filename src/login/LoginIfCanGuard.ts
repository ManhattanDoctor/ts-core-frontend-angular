import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import * as _ from 'lodash';
import { LoginBaseService } from './LoginBaseService';
import { LoginGuard } from './LoginGuard';
import { LoginNotGuard } from './LoginNotGuard';

@Injectable({ providedIn: 'root' })
export class LoginIfCanGuard<T extends LoginBaseService = LoginBaseService> extends LoginGuard<T> {
    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(@Inject(LoginBaseService) login: T, protected router: Router) {
        super(login, router);
    }

    // --------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    // --------------------------------------------------------------------------

    protected async loginIfCan(): Promise<void> {
        if (this.login.loginBySidIfCan()) {
            try {
                await this.resolve();
            } catch (error) {}
        }
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
        if (state.url !== LoginGuard.redirectUrl) {
            LoginNotGuard.redirectUrl = state.url;
        }
        if (!this.isLoggedIn()) {
            await this.loginIfCan();
        }
        return super.canActivate(route, state);
    }
}
