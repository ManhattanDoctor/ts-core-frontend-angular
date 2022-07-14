import { Component, ElementRef } from '@angular/core';
import { ViewUtil } from '../../../util/ViewUtil';
import { WindowElement } from '../WindowElement';
import * as _ from 'lodash';
import { WindowEvent } from '../../IWindow';

@Component({
    selector: 'vi-window-resize-element',
    styleUrls: ['window-resize-element.component.scss'],
    template: ''
})
export class WindowResizeElementComponent extends WindowElement {
    // --------------------------------------------------------------------------
    //
    // 	Constants
    //
    // --------------------------------------------------------------------------

    public static ICON_CLASS: string = 'fas fa-arrows-alt';
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

        if (!_.isNil(WindowResizeElementComponent.ICON_VALUE)) {
            ViewUtil.setProperty(this.nativeElement, 'innerHTML', WindowResizeElementComponent.ICON_VALUE);
        }
        if (!_.isNil(WindowResizeElementComponent.ICON_CLASS)) {
            ViewUtil.addClasses(this.nativeElement, WindowResizeElementComponent.ICON_CLASS);
        }

        ViewUtil.setStyle(this.nativeElement, 'cursor', 'pointer');
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
