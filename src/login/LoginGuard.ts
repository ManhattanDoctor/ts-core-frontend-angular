import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { LoginBaseService } from './LoginBaseService';
import { LoginRequireResolver } from './LoginRequireResolver';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoginGuard<T extends LoginBaseService = LoginBaseService> extends LoginRequireResolver<T> implements CanActivate {
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

    constructor(@Inject(LoginBaseService) login: T, protected router: Router) {
        super(login);
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.isLoggedIn() ? true : this.router.parseUrl(LoginGuard.redirectUrl);
    }
}
