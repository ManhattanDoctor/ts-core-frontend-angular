import { Inject, Injectable } from '@angular/core';
import { LoginBaseService } from './LoginBaseService';
import { LoginRequireResolver } from './LoginRequireResolver';

@Injectable({ providedIn: 'root' })
export class LoginResolver<T extends LoginBaseService> extends LoginRequireResolver<T> {
    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(@Inject(LoginBaseService) login: T) {
        super(login);
    }
}
