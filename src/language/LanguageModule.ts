import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { ICookieService } from '@ts-core/frontend/cookie';
import { ILanguageServiceOptions, LanguageService } from '@ts-core/frontend/language';
import { CookieModule } from '../cookie/CookieModule';
import { CookieService } from '../cookie/CookieService';
import { LanguageMatPaginatorIntl } from './LanguageMatPaginatorIntl';
import { LanguagePipe } from './LanguagePipe';
import { LanguagePipePure } from './LanguagePipePure';
import { LanguageResolver } from './LanguageResolver';
import { LanguageDirective } from './LanguageDirective';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { LanguagePipeHas } from './LanguagePipeHas';
import { LanguagePipeHasPure } from './LanguagePipeHasPure';
import { LanguageHasDirective } from './LanguageHasDirective';

@NgModule({
    imports: [CookieModule],
    declarations: [LanguagePipe, LanguagePipePure, LanguagePipeHas, LanguagePipeHasPure, LanguageHasDirective, LanguageDirective],
    exports: [LanguagePipe, LanguagePipePure, LanguagePipeHas, LanguagePipeHasPure, LanguageHasDirective, LanguageDirective]
})
export class LanguageModule {
    // --------------------------------------------------------------------------
    //
    // 	Static Methods
    //
    // --------------------------------------------------------------------------

    public static forRoot(options?: ILanguageServiceOptions): ModuleWithProviders<LanguageModule> {
        return {
            ngModule: LanguageModule,
            providers: [
                {
                    provide: LANGUAGE_OPTIONS,
                    useValue: options || {}
                },
                {
                    provide: LanguageService,
                    deps: [CookieService, LANGUAGE_OPTIONS],
                    useFactory: languageServiceFactory
                },
                {
                    provide: LanguageResolver,
                    deps: [LanguageService],
                    useClass: LanguageResolver
                },
                {
                    provide: MatPaginatorIntl,
                    deps: [LanguageService],
                    useClass: LanguageMatPaginatorIntl
                }
            ]
        };
    }
}

export function languageServiceFactory(cookie: ICookieService, options?: ILanguageServiceOptions): LanguageService {
    if (options && !options.service) {
        options.service = cookie;
    }
    return new LanguageService(options);
}

export const LANGUAGE_OPTIONS = new InjectionToken<ILanguageServiceOptions>(`LANGUAGE_OPTIONS`);
