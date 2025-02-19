import { Directive, HostListener } from '@angular/core';
import { ArrayUtil, Destroyable } from '@ts-core/common';
import { LanguageService } from '@ts-core/frontend';

@Directive({
    selector: '[vi-language-toggle]',
    standalone: false
})
export class LanguageToggleDirective extends Destroyable {
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
    //	Event Handlers
    //
    // --------------------------------------------------------------------------

    @HostListener('click')
    protected clickHandler() {
        let items = this.language.languages.collection;
        if (items.length > 1) {
            this.language.language = ArrayUtil.nextItem(this.language.language, items, true);
        }
    }

    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.language = null;
    }
}
