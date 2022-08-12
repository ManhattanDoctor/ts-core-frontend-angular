import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { ICookieService, NativeWindowService } from '@ts-core/frontend';
import { IThemeServiceOptions, ThemeService, ThemeAssetService } from '@ts-core/frontend';
import { CookieModule } from '../cookie/CookieModule';
import { CookieService } from '../cookie/CookieService';
import { ThemeAssetBackgroundDirective } from './ThemeAssetBackgroundDirective';
import { ThemeAssetImageDirective } from './ThemeAssetImageDirective';
import { ThemeToggleDirective } from './ThemeToggleDirective';
import { ThemeStyleDirective } from './ThemeStyleDirective';
import { ThemeStyleHoverDirective } from './ThemeStyleHoverDirective';
import * as _ from 'lodash';

let declarations = [ThemeToggleDirective, ThemeAssetImageDirective, ThemeAssetBackgroundDirective, ThemeStyleDirective, ThemeStyleHoverDirective];

@NgModule({
    imports: [CookieModule],
    declarations,
    exports: declarations
})
export class ThemeModule {
    // --------------------------------------------------------------------------
    //
    // 	Static Methods
    //
    // --------------------------------------------------------------------------

    public static forRoot(options?: IThemeServiceOptions): ModuleWithProviders<ThemeModule> {
        return {
            ngModule: ThemeModule,
            providers: [
                {
                    provide: THEME_OPTIONS,
                    useValue: options || {}
                },
                {
                    provide: ThemeService,
                    deps: [NativeWindowService, CookieService, THEME_OPTIONS],
                    useFactory: themeServiceFactory
                },
                {
                    provide: ThemeAssetService,
                    deps: [ThemeService, NativeWindowService],
                    useFactory: themeAssetServiceFactory
                }
            ]
        };
    }
}

export function themeServiceFactory(nativeWindow: NativeWindowService, cookie: ICookieService, options?: IThemeServiceOptions): ThemeService {
    if (!_.isNil(options) && _.isNil(options.service)) {
        options.service = cookie;
    }
    return new ThemeService(options, nativeWindow.document);
}

export function themeAssetServiceFactory(theme: ThemeService): ThemeAssetService {
    return new ThemeAssetService(theme);
}

export const THEME_OPTIONS = new InjectionToken<IThemeServiceOptions>(`THEME_OPTIONS`);
