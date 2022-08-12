import { Pipe, PipeTransform } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { LanguageService } from '@ts-core/frontend';

@Pipe({
    name: 'viTranslatePure'
})
export class LanguagePipePure extends DestroyableContainer implements PipeTransform {
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

    public transform(key: string, params?: any): string {
        return this.language.translate(key, params);
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.language = null;
    }
}
