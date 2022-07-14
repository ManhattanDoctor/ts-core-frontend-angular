import { Component, ElementRef } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ViewUtil } from '../../../util/ViewUtil';
import { WindowEvent } from '../../../window/IWindow';
import { WindowElement } from '../WindowElement';
import * as _ from 'lodash';

@Component({
    selector: 'vi-window-minimize-element',
    styleUrls: ['window-minimize-element.component.scss'],
    template: ''
})
export class WindowMinimizeElementComponent extends WindowElement {
    // --------------------------------------------------------------------------
    //
    // 	Constants
    //
    // --------------------------------------------------------------------------

    public static ICON_CLASS: string = null;
    public static ICON_MINIMIZE_VALUE: string = null;
    public static ICON_MAXIMIZE_VALUE: string = null;

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

    private commitIconProperties = (): void => {
        let icon = this.window.isMinimized ? WindowMinimizeElementComponent.ICON_MAXIMIZE_VALUE : WindowMinimizeElementComponent.ICON_MINIMIZE_VALUE;
        ViewUtil.setProperty(this.nativeElement, 'innerHTML', icon);
    };

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected commitWindowProperties(): void {
        super.commitWindowProperties();
        this.window.events.pipe(takeUntil(this.destroyed)).subscribe(event => {
            if (event === WindowEvent.MINIMIZED_CHANGED) {
                this.commitIconProperties();
            }
        });
    }

    protected createChildren(): void {
        super.createChildren();

        if (!_.isNil(WindowMinimizeElementComponent.ICON_MINIMIZE_VALUE)) {
            ViewUtil.setProperty(this.nativeElement, 'innerHTML', WindowMinimizeElementComponent.ICON_MINIMIZE_VALUE);
        }

        if (!_.isNil(WindowMinimizeElementComponent.ICON_CLASS)) {
            ViewUtil.addClasses(this.nativeElement, WindowMinimizeElementComponent.ICON_CLASS);
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
            this.window.isMinimized = !this.window.isMinimized;
        }
    }
}
