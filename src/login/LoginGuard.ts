import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { LoginBaseService } from './LoginBaseService';
import { LoginRequireResolver } from './LoginRequireResolver';

@Injectable({ providedIn: 'root' })
export class LoginGuard extends LoginRequireResolver implements CanActivate {
    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(login: LoginBaseService) {
        super(login);
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public canActivate(): boolean {
        return this.login.isLoggedIn;
    }
}
