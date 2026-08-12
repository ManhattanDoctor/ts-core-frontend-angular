import { Pipe, PipeTransform } from '@angular/core';
import { Destroyable } from '@ts-core/common';
import { LanguageService } from '@ts-core/frontend';
import * as _ from 'lodash';

@Pipe({
    name: 'viTranslateHasPure',
    pure: true
})
export class LanguagePipeHasPure extends Destroyable implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private language: LanguageService) {
        super();
    }

    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform(key: string): boolean {
        return this.language.isHasTranslation(key);
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.language = null;
    }
}
