import { ComponentFactoryResolver, ComponentRef, ViewContainerRef } from '@angular/core';
import { APPLICATION_INJECTOR } from '../../ApplicationInjector';
import { ViewUtil } from '../../util/ViewUtil';
import { WindowCloseElementComponent } from './window-close-element/window-close-element.component';
import { WindowMinimizeElementComponent } from './window-minimize-element/window-minimize-element.component';
import { WindowResizeElementComponent } from './window-resize-element/window-resize-element.component';
import { WindowDragable } from './WindowDragable';

export class WindowBaseComponent extends WindowDragable {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static CLOSE_COMPONENT = WindowCloseElementComponent;
    public static RESIZE_COMPONENT = WindowResizeElementComponent;
    public static MINIMIZE_COMPONENT = WindowMinimizeElementComponent;

    // --------------------------------------------------------------------------
    //
    //  Properties Methods
    //
    // --------------------------------------------------------------------------

    protected closeWindow: ComponentRef<any>;
    protected resizedWindow: ComponentRef<any>;
    protected minimizeWindow: ComponentRef<any>;

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected setProperties(): void {
        super.setProperties();
        this.createWindowComponents();
    }

    protected createWindowComponents(): void {
        if (!(this.content.container instanceof ViewContainerRef)) {
            return;
        }
        if (!this.config.disableClose && !this.closeWindow) {
            let factory = this.resolver.resolveComponentFactory(WindowBaseComponent.CLOSE_COMPONENT);
            this.closeWindow = this.content.container.createComponent(factory);
            this.closeWindow.instance.window = this;
        }

        if (this.config.isResizeable && !this.resizedWindow) {
            let factory = this.resolver.resolveComponentFactory(WindowBaseComponent.RESIZE_COMPONENT);
            this.resizedWindow = this.content.container.createComponent(factory);
            this.resizedWindow.instance.window = this;
        }

        if (this.config.isMinimizable && !this.minimizeWindow) {
            let factory = this.resolver.resolveComponentFactory(WindowBaseComponent.MINIMIZE_COMPONENT);
            this.minimizeWindow = this.content.container.createComponent(factory);
            this.minimizeWindow.instance.window = this;
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
        ViewUtil.toggleClass(this.container, this.shakingClass, this.isShaking);
    }

    protected commitIsMinimizedProperties(): void {
        ViewUtil.toggleClass(this.container, this.minimizedClass, this.isMinimized);
        ViewUtil.toggleClass(this.content.element, this.minimizedClass, this.isMinimized);
        ViewUtil.toggleClass(this.content.element.nativeElement.parentElement, this.minimizedClass, this.isMinimized);
    }

    protected isNeedClickStopPropagation(event: MouseEvent): boolean {
        if (!super.isNeedClickStopPropagation(event)) {
            return false;
        }
        if (this.closeWindow && this.closeWindow.location.nativeElement === event.target) {
            return false;
        }
        return true;
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Properties
    //
    // --------------------------------------------------------------------------

    protected get resolver(): ComponentFactoryResolver {
        return APPLICATION_INJECTOR().get(ComponentFactoryResolver);
    }

    protected get blinkClass(): string {
        return 'blink';
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

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        // Components will destroy automatically
        this.closeWindow = null;
        this.resizedWindow = null;
        this.minimizeWindow = null;
    }
}
