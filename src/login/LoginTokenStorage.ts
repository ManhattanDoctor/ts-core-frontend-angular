import { CookieService } from '../cookie/CookieService';
import { ValueStorage } from '../storage/ValueStorage';
import { LocalStorageService } from '../storage/LocalStorageService';
import * as _ from 'lodash';

export class LoginTokenStorage<T = string> extends ValueStorage<T> {
    //--------------------------------------------------------------------------
    //
    // 	Properties
    //
    //--------------------------------------------------------------------------

    public static TOKEN_KEY = 'sid';

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(local: LocalStorageService, cookies: CookieService) {
        super(LoginTokenStorage.TOKEN_KEY, local, cookies);
    }
}
