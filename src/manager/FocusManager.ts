import { ElementRef } from '@angular/core';
import { Destroyable } from '@ts-core/common';
import { ViewUtil } from '../util/ViewUtil';
import * as _ from 'lodash';

export class FocusManager extends Destroyable {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    protected timer: any;
    protected delay: number;
    protected element: HTMLElement;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(element: ElementRef, delay: number = 100) {
        super();
        this.delay = delay;
        this.element = ViewUtil.parseElement(element);
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    private focusElement = (): void => {
        if (!_.isNil(this.element)) {
            ViewUtil.focusInput(this.element as any);
        }
    };

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public focus(): void {
        clearTimeout(this.timer);
        this.timer = setTimeout(this.focusElement, this.delay);
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();

        if (!_.isNil(this.timer)) {
            clearTimeout(this.timer);
            this.timer = null;
        }

        this.element = null;
    }
}
