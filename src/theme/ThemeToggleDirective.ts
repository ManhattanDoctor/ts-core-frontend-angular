import { Directive, HostListener } from '@angular/core';
import { ArrayUtil, Destroyable } from '@ts-core/common';
import { ThemeService } from '@ts-core/frontend';

@Directive({
    selector: '[vi-theme-toggle]',
    standalone: false
})
export class ThemeToggleDirective extends Destroyable {
    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private theme: ThemeService) {
        super();
    }

    // --------------------------------------------------------------------------
    //
    //	Event Handlers
    //
    // --------------------------------------------------------------------------

    @HostListener('click')
    protected clickHandler() {
        let items = this.theme.themes.collection;
        if (items.length > 1) {
            this.theme.theme = ArrayUtil.nextItem(this.theme.theme, items, true);
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
        this.theme = null;
    }
}
