import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { ICookieService } from '@ts-core/frontend';
import { ILanguageServiceOptions, LanguageService } from '@ts-core/frontend';
import { CookieService } from '../cookie/CookieService';
import { LanguagePipe } from './LanguagePipe';
import { LanguagePipePure } from './LanguagePipePure';
import { LanguageResolver } from './LanguageResolver';
import { LanguageDirective } from './LanguageDirective';
import { LanguagePipeHas } from './LanguagePipeHas';
import { LanguagePipeHasPure } from './LanguagePipeHasPure';
import { LanguageHasDirective } from './LanguageHasDirective';
import { CookieModule } from '../cookie/CookieModule';
import * as _ from 'lodash';

let declarations = [LanguagePipe, LanguagePipePure, LanguagePipeHas, LanguagePipeHasPure, LanguageHasDirective, LanguageDirective];

@NgModule({
    imports: [CookieModule],
    exports: declarations,
    declarations
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
                }
            ]
        };
    }
}

export function languageServiceFactory(cookie: ICookieService, options?: ILanguageServiceOptions): LanguageService {
    if (!_.isNil(options) && _.isNil(options.service)) {
        options.service = cookie;
    }
    return new LanguageService(options);
}

export const LANGUAGE_OPTIONS = new InjectionToken<ILanguageServiceOptions>(`LANGUAGE_OPTIONS`);
