import { Observable, Subject, takeUntil, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { DestroyableContainer } from '@ts-core/common';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { WindowConfig } from '../window/WindowConfig';
import { IWindow, WindowEvent } from '../window/IWindow';
import { IWindowContent } from '../window/IWindowContent';
import { WindowProperties } from '../window/WindowProperties';
import { ViewUtil } from '../util/ViewUtil';
import { WindowElement } from '../window/component/WindowElement';
import { ArrayUtil } from '@ts-core/common';
import { ComponentRef } from '@angular/core';

export class BottomSheetImpl<T = any> extends DestroyableContainer implements IWindow {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    private _wrapper: HTMLElement;
    private _backdrop: HTMLElement;
    private _container: HTMLElement;
    private _isDisabled: boolean = false;

    protected elements: Array<ComponentRef<WindowElement>>;
    protected properties: WindowProperties;

    protected observer: Subject<string>;
    protected subscription: Subscription;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(properties: WindowProperties) {
        super();
        this.observer = new Subject();

        this.properties = properties;
        this.content.window = this;

        // Have to save for unsubscribe on destroy
        this._wrapper = this.properties.overlay.hostElement;
        this._backdrop = this.properties.overlay.backdropElement;
        this._container = this.properties.overlay.overlayElement;

        this.setProperties();
        this.elementsCreate();

        this.getReference().afterOpened().pipe(takeUntil(this.destroyed)).subscribe(this.setOpened);
        this.getReference().afterDismissed().pipe(takeUntil(this.destroyed)).subscribe(this.setClosed);
    }

    // --------------------------------------------------------------------------
    //
    //  Elements Methods
    //
    // --------------------------------------------------------------------------

    protected elementsCreate(): void {
        this.elements = new Array();
    }

    protected elementsDestroy(): void {
        this.elements.forEach(item => this.elementDestroy(item));
        this.elements = null;
    }

    protected elementAdd(item: ComponentRef<WindowElement>): ComponentRef<WindowElement> {
        this.elements.push(item);
        item.instance.window = this;
        return item;
    }

    protected elementRemove(item: ComponentRef<WindowElement>): ComponentRef<WindowElement> {
        ArrayUtil.remove(this.elements, item);
        this.elementDestroy(item);
        return item;
    }

    protected elementDestroy(item: ComponentRef<WindowElement>): ComponentRef<WindowElement> {
        item.instance.window = null;
        item.destroy();
        return item;
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected setClosed = (): void => {
        this.emit(WindowEvent.CLOSED);
        this.destroy();
    };

    protected setOpened = (): void => {
        this.emit(WindowEvent.OPENED);
    };

    protected setProperties(): void {
        ViewUtil.addClass(this.container, 'vi-bottom-sheet');
        ViewUtil.toggleClass(this.container, 'vi-modal', this.config.isModal);

        this.container.addEventListener('click', this.mouseClickHandlerProxy, true);
        this.container.addEventListener('mousedown', this.mouseDownHandlerProxy);
        /*
        if (!this.config.isModal) {
            this.container.addEventListener('mousedown', this.mouseDownHandlerProxy);
        }
        */
    }

    protected commitIsDisabledProperties(): void {}

    protected getConfig(): WindowConfig {
        return this.properties.config;
    }
    protected getContainer(): HTMLElement {
        return this.container;
    }
    protected getReference(): MatBottomSheetRef<IWindowContent<T>> {
        return this.properties.reference as any;
    }

    protected isNeedClickStopPropagation(event: MouseEvent): boolean {
        let element = _.find(this.elements, item => item.location.nativeElement === event.target);
        if (_.isNil(element)) {
            return false;
        }
        element.instance.clickHandler(event);
        return true;
    }

    // --------------------------------------------------------------------------
    //
    //  Event Handlers
    //
    // --------------------------------------------------------------------------

    protected mouseDownHandler(event: MouseEvent): void {
        this.setOnTop();
    }

    protected mouseClickHandler(event: MouseEvent): void {
        if (this.isNeedClickStopPropagation(event)) {
            event.stopPropagation();
        }
    }

    private mouseDownHandlerProxy = (event: MouseEvent): void => {
        this.mouseDownHandler(event);
    };

    private mouseClickHandlerProxy = (event: MouseEvent): void => {
        this.mouseClickHandler(event);
    };

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public emit(event: string): void {
        this.observer.next(event);
    }

    public close(): void {
        this.getReference().dismiss();
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.elementsDestroy();

        this._container.removeEventListener('click', this.mouseClickHandlerProxy, true);
        this._container.removeEventListener('mousedown', this.mouseDownHandlerProxy);

        if (!_.isNil(this.content)) {
            this.content.destroy();
        }

        if (!_.isNil(this.observer)) {
            this.observer.complete();
            this.observer = null;
        }

        this.properties = null;

        this._wrapper = null;
        this._backdrop = null;
        this._container = null;
    }

    public blink(): void {}

    public shake(): void {}

    public setOnTop(): void {}

    // --------------------------------------------------------------------------
    //
    //  Size Methods
    //
    // --------------------------------------------------------------------------

    public getWidth(): number {
        return NaN;
    }

    public getHeight(): number {
        return NaN;
    }

    public setWidth(value: number, isNeedNotify: boolean = true): void {}

    public setHeight(value: number, isNeedNotify: boolean = true): void {}

    public setSize(width: number, height: number): void {}

    // --------------------------------------------------------------------------
    //
    //  Move Methods
    //
    // --------------------------------------------------------------------------

    public getX(): number {
        return NaN;
    }

    public setX(value: number, isNeedNotify: boolean = true): void {}

    public getY(): number {
        return NaN;
    }
    public setY(value: number, isNeedNotify: boolean = true): void {}

    public move(x: number, y: number): void {}

    // --------------------------------------------------------------------------
    //
    //  Private Properties
    //
    // --------------------------------------------------------------------------

    protected get reference(): MatBottomSheetRef<IWindowContent<T>> {
        return this.properties.reference as any;
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public get events(): Observable<string> {
        return this.observer.asObservable();
    }

    public get config(): WindowConfig {
        return this.properties.config;
    }

    public get content(): IWindowContent {
        return !_.isNil(this.reference) ? this.reference.instance : null;
    }

    public get container(): HTMLElement {
        return this._container;
    }

    public get wrapper(): HTMLElement {
        return this._wrapper;
    }

    public get backdrop(): HTMLElement {
        return this._backdrop;
    }

    public get isOnTop(): boolean {
        return false;
    }
    public set isOnTop(value: boolean) {}

    public get isMinimized(): boolean {
        return false;
    }
    public set isMinimized(value: boolean) {}

    public get isDisabled(): boolean {
        return this._isDisabled;
    }
    public set isDisabled(value: boolean) {
        if (value === this._isDisabled) {
            return;
        }
        this._isDisabled = value;
        this.commitIsDisabledProperties();
        this.emit(WindowEvent.DISABLED_CHANGED);
    }
}
