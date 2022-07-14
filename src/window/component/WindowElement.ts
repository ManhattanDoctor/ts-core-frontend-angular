import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { ViewUtil } from '../../util/ViewUtil';
import { IWindow } from '../IWindow';
import * as _ from 'lodash';

@Component({ template: '' })
export abstract class WindowElement extends DestroyableContainer implements AfterViewInit {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    protected _window: IWindow;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(protected element: ElementRef) {
        super();
    }

    // --------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    // --------------------------------------------------------------------------

    protected checkWindowParent(): void {
        let container = this.getContainer();
        if (!_.isNil(container)) {
            ViewUtil.appendChild(container, this.element.nativeElement);
        }
    }

    protected getContainer(): HTMLElement {
        let item = ViewUtil.parseElement(this.element.nativeElement);
        while (!_.isNil(item) && item.nodeName.toLowerCase() !== 'mat-dialog-container') {
            item = item.parentElement;
        }
        return item;
    }

    protected createChildren(): void {}

    protected destroyChildren(): void {}

    protected commitWindowProperties(): void {}

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public ngAfterViewInit(): void {
        this.createChildren();
        this.checkWindowParent();
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.destroyChildren();

        this.element = null;
        this.window = null;
    }

    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    public clickHandler(event: MouseEvent): void {
        event.stopPropagation();
    }

    // --------------------------------------------------------------------------
    //
    // 	Protected Properties
    //
    // --------------------------------------------------------------------------

    protected get nativeElement(): HTMLElement {
        return this.element ? this.element.nativeElement : null;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get window(): IWindow {
        return this._window;
    }
    public set window(value: IWindow) {
        if (value === this._window) {
            return;
        }
        this._window = value;
        if (this.window) {
            this.commitWindowProperties();
        }
    }
}
