import { CookieService } from '../cookie/CookieService';
import { ValueStorage } from '../storage/ValueStorage';
import { LocalStorageService } from '../storage/LocalStorageService';
import * as _ from 'lodash';

export class LoginTokenStorage extends ValueStorage {
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

    constructor(localStorage: LocalStorageService, cookies: CookieService) {
        super(LoginTokenStorage.TOKEN_KEY, localStorage, cookies);
    }
}
