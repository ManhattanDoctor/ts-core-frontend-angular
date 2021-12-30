import { ComponentFactoryResolver, ComponentRef, ViewContainerRef } from '@angular/core';
import { APPLICATION_INJECTOR } from '../../ApplicationInjector';
import { ViewUtil } from '../../util/ViewUtil';
import { BottomSheetImpl } from '../BottomSheetImpl';
import { BottomSheetCloseElementComponent } from './bottom-sheet-close-element/bottom-sheet-close-element.component';

export class BottomSheetBaseComponent extends BottomSheetImpl {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static CLOSE_COMPONENT = BottomSheetCloseElementComponent;

    // --------------------------------------------------------------------------
    //
    //  Properties Methods
    //
    // --------------------------------------------------------------------------

    protected closeWindow: ComponentRef<any>;

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
            let factory = this.resolver.resolveComponentFactory(BottomSheetBaseComponent.CLOSE_COMPONENT);
            this.closeWindow = this.content.container.createComponent(factory);
            this.closeWindow.instance.window = this;
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
    }
}
