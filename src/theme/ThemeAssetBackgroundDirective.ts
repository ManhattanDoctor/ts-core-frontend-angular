import { Directive, ElementRef } from '@angular/core';
import { ThemeAssetService, ThemeService } from '@ts-core/frontend';
import { ViewUtil } from '../util/ViewUtil';
import { ThemeAssetDirective } from './ThemeAssetDirective';

@Directive({
    selector: '[vi-theme-background]'
})
export class ThemeAssetBackgroundDirective extends ThemeAssetDirective {
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
        let value = 'url(' + this.source + ')';
        ViewUtil.setStyle(this.element, 'backgroundImage', value);
    }

    protected removeSourceProperties(): void {
        ViewUtil.removeStyle(this.element, 'backgroundImage');
    }
}
