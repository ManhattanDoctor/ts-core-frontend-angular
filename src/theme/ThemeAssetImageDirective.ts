import { Directive, ElementRef } from '@angular/core';
import { ThemeService } from '@ts-core/frontend/theme';
import { ThemeAssetDirective } from './ThemeAssetDirective';

@Directive({
    selector: '[vi-theme-image]'
})
export class ThemeAssetImageDirective extends ThemeAssetDirective<HTMLImageElement> {
    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(element: ElementRef, theme: ThemeService) {
        super(element, theme);
    }

    // --------------------------------------------------------------------------
    //
    //	Private Methods
    //
    // --------------------------------------------------------------------------

    protected commitSourceProperties(): void {
        this.element.src = this.source;
    }
    protected removeSourceProperties(): void {
        this.element.src = null;
    }
}
