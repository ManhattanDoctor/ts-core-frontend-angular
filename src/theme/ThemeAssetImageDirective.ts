import { Directive, ElementRef, Input } from '@angular/core';
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
        this.isImage = true;
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

    // --------------------------------------------------------------------------
    //
    //	Public Properties
    //
    // --------------------------------------------------------------------------

    @Input('vi-theme-image')
    public set name(value: string) {
        super.name = value;
    }
    public get name(): string {
        return super.name;
    }
}
