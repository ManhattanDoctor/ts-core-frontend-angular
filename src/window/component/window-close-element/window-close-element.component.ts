import { Component, ElementRef } from '@angular/core';
import { ViewUtil } from '../../../util/ViewUtil';
import { WindowElement } from '../WindowElement';
import * as _ from 'lodash';

@Component({
    selector: 'vi-window-close-element',
    styleUrls: ['window-close-element.component.scss'],
    template: ''
})
export class WindowCloseElementComponent extends WindowElement {
    // --------------------------------------------------------------------------
    //
    // 	Constants
    //
    // --------------------------------------------------------------------------

    public static ICON_CLASS: string = 'fas fa-times';
    public static ICON_VALUE: string = null;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(element: ElementRef) {
        super(element);
    }

    // --------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    // --------------------------------------------------------------------------

    protected createChildren(): void {
        super.createChildren();

        if (!_.isNil(WindowCloseElementComponent.ICON_VALUE)) {
            ViewUtil.setProperty(this.nativeElement, 'innerHTML', WindowCloseElementComponent.ICON_VALUE);
        }
        if (!_.isNil(WindowCloseElementComponent.ICON_CLASS)) {
            ViewUtil.addClasses(this.nativeElement, WindowCloseElementComponent.ICON_CLASS);
        }
        ViewUtil.addClass(this.nativeElement, 'mouse-active');
        this.nativeElement.addEventListener('click', this.mouseClickHandler, true);
    }

    protected destroyChildren(): void {
        super.destroyChildren();
        this.nativeElement.removeEventListener('click', this.mouseClickHandler, true);
    }

    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    private mouseClickHandler = (event: MouseEvent): void => {
        event.stopPropagation();
        if (!_.isNil(this.window)) {
            this.window.close();
        }
    };
}
