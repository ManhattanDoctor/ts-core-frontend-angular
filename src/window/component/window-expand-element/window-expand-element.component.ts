import { Component, ElementRef } from '@angular/core';
import * as _ from 'lodash';
import { ViewUtil } from '../../../util/ViewUtil';
import { WindowEvent } from '../../IWindow';
import { WindowElement } from '../WindowElement';

@Component({
    selector: 'vi-window-expand-element',
    styleUrls: ['window-expand-element.component.scss'],
    template: ''
})
export class WindowExpandElementComponent extends WindowElement {
    // --------------------------------------------------------------------------
    //
    // 	Constants
    //
    // --------------------------------------------------------------------------

    public static ICON_CLASS: string = 'fas fa-angle-double-up';
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

        if (!_.isNil(WindowExpandElementComponent.ICON_VALUE)) {
            ViewUtil.setProperty(this.nativeElement, 'innerHTML', WindowExpandElementComponent.ICON_VALUE);
        }
        if (!_.isNil(WindowExpandElementComponent.ICON_CLASS)) {
            ViewUtil.addClasses(this.nativeElement, WindowExpandElementComponent.ICON_CLASS);
        }
        ViewUtil.addClass(this.nativeElement, 'mouse-active');
    }

    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    public clickHandler(event: MouseEvent): void {
        super.clickHandler(event);
        if (!_.isNil(this.window)) {
            this.window.emit(WindowEvent.EXPAND);
        }
    }
}
