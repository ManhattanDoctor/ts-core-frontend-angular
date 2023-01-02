import { ViewContainerRef } from '@angular/core';
import { ViewUtil } from '../../util/ViewUtil';
import { BottomSheetImpl } from '../BottomSheetImpl';
import { WindowBaseComponent } from '../../window/component/WindowBaseComponent';

export class BottomSheetBaseComponent extends BottomSheetImpl {
    // --------------------------------------------------------------------------
    //
    //  Static Properties
    //
    // --------------------------------------------------------------------------

    public static CLOSE_COMPONENT = WindowBaseComponent.CLOSE_COMPONENT;
    public static EXPAND_COMPONENT = WindowBaseComponent.EXPAND_COMPONENT;

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
            this.elementAdd(this.content.container.createComponent(BottomSheetBaseComponent.CLOSE_COMPONENT));
        }
        if (this.config.isExpandable) {
            this.elementAdd(this.content.container.createComponent(BottomSheetBaseComponent.EXPAND_COMPONENT));
        }
    }

    protected commitIsDisabledProperties(): void {
        ViewUtil.toggleClass(this.container, this.disabledClass, this.isDisabled);
        ViewUtil.toggleClass(this.content.element, this.disabledClass, this.isDisabled);
        ViewUtil.toggleClass(this.content.element.nativeElement.parentElement, this.disabledClass, this.isDisabled);
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Properties
    //
    // --------------------------------------------------------------------------

    protected get disabledClass(): string {
        return 'vi-disabled';
    }
}
