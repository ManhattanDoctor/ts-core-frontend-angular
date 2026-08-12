import { Directive, ElementRef, HostListener } from '@angular/core';
import { Destroyable } from '@ts-core/common';
import { ViewUtil } from '../util/ViewUtil';
import * as _ from 'lodash';

@Directive({
    selector: '[vi-select-on-focus]'
})
export class SelectOnFocusDirective extends Destroyable {
    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private element: ElementRef) {
        super();
    }

    // --------------------------------------------------------------------------
    //
    //	Event Handlers
    //
    // --------------------------------------------------------------------------

    @HostListener('focus')
    public focusHandler(): void {
        ViewUtil.selectContent(this.element);
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
        this.element = null;
    }
}
