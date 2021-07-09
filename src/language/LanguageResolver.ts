import { LanguageService } from '@ts-core/frontend/language';
import { LanguageRequireResolver } from './LanguageRequireResolver';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LanguageResolver extends LanguageRequireResolver {
    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(language: LanguageService) {
        super(language);
    }
}
