import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { LoginServiceBase } from './LoginServiceBase';
import { LoginRequireResolver } from './LoginRequireResolver';
import * as _ from 'lodash';

@Injectable({ providedIn: 'root' })
export class LoginGuard<T extends LoginServiceBase = LoginServiceBase> extends LoginRequireResolver<T> implements CanActivate {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    public static redirectUrl: string = '/login';

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(
        @Inject(LoginServiceBase) login: T,
        protected router: Router
    ) {
        super(login);
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Promise<boolean | UrlTree> {
        return this.isLoggedIn() ? true : this.router.parseUrl(LoginGuard.redirectUrl);
    }
}
