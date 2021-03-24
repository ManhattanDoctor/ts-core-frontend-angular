import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { ICookieService } from '@ts-core/frontend/cookie';
import { IThemeServiceOptions, ThemeService } from '@ts-core/frontend/theme';
import { CookieModule } from '../cookie/CookieModule';
import { CookieService } from '../cookie/CookieService';
import { ThemeAssetBackgroundDirective } from './ThemeAssetBackgroundDirective';
import { ThemeAssetDirective } from './ThemeAssetDirective';
import { ThemeImageDirective } from './ThemeImageDirective';
import { ThemeStyleDirective } from './ThemeStyleDirective';
import { ThemeToggleDirective } from './ThemeToggleDirective';
import * as _ from 'lodash';

@NgModule({
    imports: [CookieModule],
    declarations: [ThemeAssetDirective, ThemeImageDirective, ThemeToggleDirective, ThemeAssetBackgroundDirective, ThemeStyleDirective],
    exports: [ThemeAssetDirective, ThemeImageDirective, ThemeToggleDirective, ThemeAssetBackgroundDirective, ThemeStyleDirective]
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
                    deps: [CookieService, THEME_OPTIONS],
                    useFactory: themeServiceFactory
                }
            ]
        };
    }
}

export function themeServiceFactory(cookie: ICookieService, options?: IThemeServiceOptions): ThemeService {
    if (!_.isNil(options) && !_.isNil(options.service)) {
        options.service = cookie;
    }
    return new ThemeService(options);
}

export const THEME_OPTIONS = new InjectionToken<IThemeServiceOptions>(`THEME_OPTIONS`);
