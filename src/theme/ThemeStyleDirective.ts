import { Directive, ElementRef, Input, RendererStyleFlags2 } from '@angular/core';
import { Destroyable } from '@ts-core/common';
import { ThemeService } from '@ts-core/frontend';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs';
import { ViewUtil } from '../util/ViewUtil';

@Directive({
    selector: '[vi-theme-style]'
})
export class ThemeStyleDirective extends Destroyable {
    // --------------------------------------------------------------------------
    //
    //	Properties
    //
    // --------------------------------------------------------------------------

    protected _key: string;
    protected _flags: RendererStyleFlags2;
    protected _styleName: string;

    protected element: HTMLElement;

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(element: ElementRef, protected theme: ThemeService) {
        super();

        this.element = ViewUtil.parseElement(element.nativeElement);
        this.theme.changed.pipe(takeUntil(this.destroyed)).subscribe(() => this.stylePropertiesCheck());
    }

    // --------------------------------------------------------------------------
    //
    //	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected commitStyleProperties(name: string, value: string): void {
        ViewUtil.setStyle(this.element, name, value, this.flags);
    }

    protected stylePropertiesCheck(): void {
        if (this.isNeedStyleAdd()) {
            this.stylePropertiesAdd();
        } else if (this.isNeedStyleRemove()) {
            this.stylePropertiesRemove();
        }
    }

    protected stylePropertiesRemove(): void {
        ViewUtil.removeStyle(this.element, this.styleName);
    }

    protected stylePropertiesAdd(): void {
        this.commitStyleProperties(this.styleName, this.theme.getStyle(this.key));
    }

    protected isNeedStyleAdd(): boolean {
        return !_.isNil(this.theme.theme) && !_.isNil(this.styleName);
    }

    protected isNeedStyleRemove(): boolean {
        return !_.isNil(this.styleName);
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

        this.key = null;
        this.theme = null;
        this.element = null;
    }

    // --------------------------------------------------------------------------
    //
    //	Public Properties
    //
    // --------------------------------------------------------------------------

    public get flags(): RendererStyleFlags2 {
        return this._flags;
    }
    @Input()
    public set flags(value: RendererStyleFlags2) {
        if (value === this._flags) {
            return;
        }
        this._flags = value;
        this.stylePropertiesCheck();
    }

    public get styleName(): string {
        return this._styleName;
    }
    @Input()
    public set styleName(value: string) {
        if (value === this._styleName) {
            return;
        }
        this._styleName = value;
        this.stylePropertiesCheck();
    }

    public get key(): string {
        return this._key;
    }
    @Input('vi-theme-style')
    public set key(value: string) {
        if (value === this._key) {
            return;
        }
        this._key = value;
        if (!_.isNil(value)) {
            this.stylePropertiesCheck();
        }
    }
}
