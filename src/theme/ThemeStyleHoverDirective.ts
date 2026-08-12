import { Directive, ElementRef, Input, RendererStyleFlags2 } from '@angular/core';
import { ThemeService } from '@ts-core/frontend';
import { ThemeStyleDirective } from './ThemeStyleDirective';
import * as _ from 'lodash';

@Directive({
    selector: '[vi-theme-style-hover]'
})
export class ThemeStyleHoverDirective extends ThemeStyleDirective {
    // --------------------------------------------------------------------------
    //
    //	Properties
    //
    // --------------------------------------------------------------------------

    protected _isHover: boolean = false;

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(element: ElementRef, theme: ThemeService) {
        super(element, theme);

        this.flags = RendererStyleFlags2.Important;
        this.element.addEventListener('mouseenter', this.mouseEnter, false);
        this.element.addEventListener('mouseleave', this.mouseLeave, false);
    }

    // --------------------------------------------------------------------------
    //
    //	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected isNeedStyleAdd(): boolean {
        return this.isHover && super.isNeedStyleAdd();
    }

    protected isNeedStyleRemove(): boolean {
        return !this.isHover || super.isNeedStyleRemove();
    }

    // --------------------------------------------------------------------------
    //
    //	Event Handlers
    //
    // --------------------------------------------------------------------------

    protected mouseEnter = (event: MouseEvent): void => {
        this.isHover = true;
    };

    protected mouseLeave = (event: MouseEvent): void => {
        this.isHover = false;
    };

    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        this.element.removeEventListener('mouseenter', this.mouseEnter, false);
        this.element.removeEventListener('mouseleave', this.mouseLeave, false);
        super.destroy();
    }

    // --------------------------------------------------------------------------
    //
    //	Public Properties
    //
    // --------------------------------------------------------------------------

    public get isHover(): boolean {
        return this._isHover;
    }
    public set isHover(value: boolean) {
        if (value === this._isHover) {
            return;
        }
        this._isHover = value;
        this.stylePropertiesCheck();
    }

    public get key(): string {
        return super.key;
    }
    @Input('vi-theme-style-hover')
    public set key(value: string) {
        super.key = value;
    }

    public get styleName(): string {
        return super.styleName;
    }
    @Input()
    public set styleName(value: string) {
        super.styleName = value;
    }

    public get flags(): RendererStyleFlags2 {
        return super.flags;
    }
    @Input()
    public set flags(value: RendererStyleFlags2) {
        super.flags = value;
    }
}
