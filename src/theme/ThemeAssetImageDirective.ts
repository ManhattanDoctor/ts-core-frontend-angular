import { Directive, ElementRef } from '@angular/core';
import { ThemeAssetService, ThemeService } from '@ts-core/frontend';
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

    constructor(element: ElementRef, theme: ThemeService, themeAsset: ThemeAssetService) {
        super(element, theme, themeAsset);
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
