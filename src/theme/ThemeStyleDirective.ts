import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Destroyable } from '@ts-core/common';
import { ThemeService } from '@ts-core/frontend/theme';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { ViewUtil } from '../util/ViewUtil';

@Directive({
    selector: '[vi-theme-style]'
})
export class ThemeStyleDirective extends Destroyable implements OnInit {
    // --------------------------------------------------------------------------
    //
    //	Properties
    //
    // --------------------------------------------------------------------------

    protected _name: string = 'color';
    protected _value: string;

    protected element: HTMLElement;

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(element: ElementRef, protected theme: ThemeService) {
        super();
        this.element = ViewUtil.parseElement(element.nativeElement);
        this.theme.changed.pipe(takeUntil(this.destroyed)).subscribe(() => {
            this.updateStyleProperties();
        });
    }

    // --------------------------------------------------------------------------
    //
    //	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected updateStyleProperties(): void {
        if (!_.isNil(this.theme.theme) && !_.isNil(this.name)) {
            ViewUtil.setStyle(this.element, this.name, this.theme.getStyle(this.value));
        }
    }

    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public ngOnInit(): void {
        this.updateStyleProperties();
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();

        this.theme = null;
        this.element = null;
    }

    // --------------------------------------------------------------------------
    //
    //	Public Properties
    //
    // --------------------------------------------------------------------------

    public get name(): string {
        return this._name;
    }
    @Input()
    public set name(value: string) {
        if (value === this._name) {
            return;
        }
        this._name = value;
        if (!_.isNil(value)) {
            this.updateStyleProperties();
        }
    }

    public get value(): string {
        return this._value;
    }
    @Input('vi-theme-style')
    public set value(value: string) {
        if (value === this._value) {
            return;
        }
        this._value = value;
        if (!_.isNil(value)) {
            this.updateStyleProperties();
        }
    }
}
