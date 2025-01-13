import { Directive, ElementRef, Input } from '@angular/core';
import { ThemeAssetService, ThemeService } from '@ts-core/frontend';
import { ViewUtil } from '../util/ViewUtil';
import { ThemeAssetDirective } from './ThemeAssetDirective';

@Directive({
    selector: '[vi-theme-background]',
    standalone: false
})
export class ThemeAssetBackgroundDirective extends ThemeAssetDirective {
    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(element: ElementRef, theme: ThemeService, themeAsset: ThemeAssetService) {
        super(element, theme, themeAsset);
        this.isBackground = true;
    }

    // --------------------------------------------------------------------------
    //
    //	Private Methods
    //
    // --------------------------------------------------------------------------

    protected addSourceProperties(): void {
        let value = 'url(' + this.source + ')';
        ViewUtil.setStyle(this.element, 'backgroundImage', value);
    }

    protected removeSourceProperties(): void {
        ViewUtil.removeStyle(this.element, 'backgroundImage');
    }

    // --------------------------------------------------------------------------
    //
    //	Public Properties
    //
    // --------------------------------------------------------------------------

    @Input('vi-theme-background')
    public set name(value: string) {
        super.name = value;
    }
    public get name(): string {
        return super.name;
    }
}
