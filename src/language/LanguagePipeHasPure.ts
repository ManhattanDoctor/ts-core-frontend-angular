import { Pipe, PipeTransform } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { LanguageService } from '@ts-core/frontend';
import { takeUntil } from 'rxjs';
import * as _ from 'lodash';

@Pipe({
    name: 'viTranslateHasPure',
    pure: true
})
export class LanguagePipeHasPure extends DestroyableContainer implements PipeTransform {
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
