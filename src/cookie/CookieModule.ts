import { EnvironmentProviders, InjectionToken, ModuleWithProviders, NgModule, Provider, makeEnvironmentProviders } from '@angular/core';
import { ICookieOptions, NativeWindowService } from '@ts-core/frontend';
import { CookieService } from './CookieService';
import { PlatformService } from '../service/PlatformService';
import * as _ from 'lodash';
import { DOCUMENT } from '@angular/common';

@NgModule()
export class CookieModule {
    // --------------------------------------------------------------------------
    //
    // 	Static Methods
    //
    // --------------------------------------------------------------------------

    public static forRoot(options?: ICookieOptions): ModuleWithProviders<CookieModule> {
        return { ngModule: CookieModule, providers: cookieProviders(options) };
    }
}

// Настройка для приложения на самостоятельных компонентах: то же, что forRoot, но без модуля
export function provideCookie(options?: ICookieOptions): EnvironmentProviders {
    return makeEnvironmentProviders(cookieProviders(options));
}

export function cookieProviders(options?: ICookieOptions): Array<Provider> {
    return [
        {
            provide: COOKIE_OPTIONS,
            useValue: options || {}
        },
        {
            provide: CookieService,
            deps: [NativeWindowService, COOKIE_OPTIONS, PlatformService],
            useFactory: cookieServiceFactory
        }
    ];
}

export function cookieServiceFactory(nativeWindow: NativeWindowService, options: ICookieOptions, platform: PlatformService): CookieService {
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
    return new CookieService(nativeWindow.document, options, platform.isPlatformBrowser);
}

export const COOKIE_OPTIONS = new InjectionToken<ICookieOptions>(`COOKIE_OPTIONS`);
