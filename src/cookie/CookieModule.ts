import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { ICookieOptions, NativeWindowService } from '@ts-core/frontend';
import { CookieService } from './CookieService';
import { PlatformService } from '../service/PlatformService';
import * as _ from 'lodash';

@NgModule()
export class CookieModule {
    // --------------------------------------------------------------------------
    //
    // 	Static Methods
    //
    // --------------------------------------------------------------------------

    public static forRoot(options?: ICookieOptions): ModuleWithProviders<CookieModule> {
        return {
            ngModule: CookieModule,
            providers: [
                {
                    provide: COOKIE_OPTIONS,
                    useValue: options || {}
                },
                {
                    provide: CookieService,
                    deps: [NativeWindowService, PlatformService, COOKIE_OPTIONS],
                    useFactory: cookieServiceFactory
                }
            ]
        };
    }
}

export function cookieServiceFactory(nativeWindow: NativeWindowService, platform: PlatformService, options: ICookieOptions): CookieService {
    options = _.assign(
        {
            path: '/',
            domain: null,
            expires: null,
            secure: false,
            httpOnly: false
        },
        options
    );
    return new CookieService(options, platform, nativeWindow.document);
}

export const COOKIE_OPTIONS = new InjectionToken<ICookieOptions>(`COOKIE_OPTIONS`);
