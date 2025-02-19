import { Inject, Injectable } from '@angular/core';
import { LoginServiceBase } from './LoginServiceBase';
import { LoginRequireResolver } from './LoginRequireResolver';

@Injectable({ providedIn: 'root' })
export class LoginResolver<T extends LoginServiceBase> extends LoginRequireResolver<T> {
    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(@Inject(LoginServiceBase) login: T) {
        super(login);
    }
}
