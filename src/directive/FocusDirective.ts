import { Directive, ElementRef, Input } from '@angular/core';
import { Destroyable } from '@ts-core/common';
import { FocusManager } from '../manager/FocusManager';
import * as _ from 'lodash';

@Directive({
    selector: '[vi-focus]',
    standalone: false
})
export class FocusDirective<T = any> extends Destroyable {
    // --------------------------------------------------------------------------
    //
    //	Properties
    //
    // --------------------------------------------------------------------------

    private manager: FocusManager;

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(element: ElementRef) {
        super();
        this.manager = new FocusManager(element);
    }

    // --------------------------------------------------------------------------
    //
    //	Private Methods
    //
    // --------------------------------------------------------------------------

    protected focus = (): void => this.manager.focus();

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

        this.manager.destroy();
        this.manager = null;
    }

    // --------------------------------------------------------------------------
    //
    //	Public Properties
    //
    // --------------------------------------------------------------------------

    @Input('vi-focus')
    public set trigger(value: T) {
        this.focus();
    }
}
