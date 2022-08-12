import { Directive, ElementRef, Input } from '@angular/core';
import { Destroyable } from '@ts-core/common';
import * as _ from 'lodash';
import { LanguagePipe } from '../language/LanguagePipe';
import { ViewUtil } from '../util/ViewUtil';

@Directive({
    selector: '[vi-html-title]'
})
export class HTMLTitleDirective extends Destroyable {
    // --------------------------------------------------------------------------
    //
    //	Properties
    //
    // --------------------------------------------------------------------------

    protected _value: string;

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(protected element: ElementRef) {
        super();
    }

    // --------------------------------------------------------------------------
    //
    //	Private Methods
    //
    // --------------------------------------------------------------------------

    protected commitValueProperties(): void {
        ViewUtil.setProperty(this.element, 'title', LanguagePipe.removeTags(this.value));
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
        this._value = null;
    }

    // --------------------------------------------------------------------------
    //
    //	Public Properties
    //
    // --------------------------------------------------------------------------

    @Input('vi-html-title')
    public set value(value: string) {
        if (value === this._value) {
            return;
        }
        this._value = value;
        if (!_.isNil(value)) {
            this.commitValueProperties();
        }
    }
    public get value(): string {
        return this._value;
    }
}
