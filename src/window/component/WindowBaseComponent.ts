import { ViewContainerRef } from '@angular/core';
import { ViewUtil } from '../../util/ViewUtil';
import { WindowCloseElementComponent } from './window-close-element/window-close-element.component';
import { WindowExpandElementComponent } from './window-expand-element/window-expand-element.component';
import { WindowResizeElementComponent } from './window-resize-element/window-resize-element.component';
import { WindowMinimizeElementComponent } from './window-minimize-element/window-minimize-element.component';
import { WindowDragable } from './WindowDragable';

export class WindowBaseComponent extends WindowDragable {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static CLOSE_COMPONENT = WindowCloseElementComponent;
    public static EXPAND_COMPONENT = WindowExpandElementComponent;
    public static RESIZE_COMPONENT = WindowResizeElementComponent;
    public static MINIMIZE_COMPONENT = WindowMinimizeElementComponent;

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected elementsCreate(): void {
        super.elementsCreate();

        if (!(this.content.container instanceof ViewContainerRef)) {
            return;
        }

        if (!this.config.disableClose) {
            this.elementAdd(this.content.container.createComponent(WindowBaseComponent.CLOSE_COMPONENT));
        }

        if (this.config.isResizeable) {
            this.elementAdd(this.content.container.createComponent(WindowBaseComponent.RESIZE_COMPONENT));
        }

        if (this.config.isMinimizable) {
            this.elementAdd(this.content.container.createComponent(WindowBaseComponent.MINIMIZE_COMPONENT));
        }

        if (this.config.isExpandable) {
            this.elementAdd(this.content.container.createComponent(WindowBaseComponent.EXPAND_COMPONENT));
        }
    }

    protected commitIsBlinkProperties(): void {
        ViewUtil.toggleClass(this.container, this.blinkClass, this.isBlink);
    }

    protected commitIsDisabledProperties(): void {
        ViewUtil.toggleClass(this.container, this.disabledClass, this.isDisabled);
        ViewUtil.toggleClass(this.content.element, this.disabledClass, this.isDisabled);
        ViewUtil.toggleClass(this.content.element.nativeElement.parentElement, this.disabledClass, this.isDisabled);
    }

    protected commitIsShakingProperties(): void {
        ViewUtil.toggleClasses(this.container, this.shakingClass, this.isShaking);
    }

    protected commitIsMinimizedProperties(): void {
        ViewUtil.toggleClass(this.container, this.minimizedClass, this.isMinimized);
        ViewUtil.toggleClass(this.content.element, this.minimizedClass, this.isMinimized);
        ViewUtil.toggleClass(this.content.element.nativeElement.parentElement, this.minimizedClass, this.isMinimized);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Properties
    //
    // --------------------------------------------------------------------------

    protected get blinkClass(): string {
        return 'vi-blink';
    }

    protected get disabledClass(): string {
        return 'vi-disabled';
    }

    protected get minimizedClass(): string {
        return 'vi-minimized';
    }

    protected get shakingClass(): string {
        return 'shake-constant shake-horizontal';
    }
}
