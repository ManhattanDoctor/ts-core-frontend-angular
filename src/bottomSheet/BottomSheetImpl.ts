import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import * as _ from 'lodash';
import { DestroyableContainer } from '@ts-core/common';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { WindowConfig } from '../window/WindowConfig';
import { IWindow, WindowEvent } from '../window/IWindow';
import { IWindowContent } from '../window/IWindowContent';
import { WindowProperties } from '../window/WindowProperties';
import { ViewUtil } from '../util/ViewUtil';
import { WindowImpl } from '../window/WindowImpl';

export class BottomSheetImpl<T = any> extends DestroyableContainer implements IWindow {
    // --------------------------------------------------------------------------
    //
    //  Constants
    //
    // --------------------------------------------------------------------------

    public static BLINK_DELAY = 500;
    public static SHAKE_DELAY = 500;

    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    private _isBlink: boolean = false;
    private blinkTimer: any;

    private _isDisabled: boolean = false;
    private _wrapper: HTMLElement;
    private _backdrop: HTMLElement;
    private _container: HTMLElement;

    protected properties: WindowProperties;

    protected subscription: Subscription;
    protected observer: Subject<string>;

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
        this.getReference().afterOpened().pipe(takeUntil(this.destroyed)).subscribe(this.setOpened);
        this.getReference().afterDismissed().pipe(takeUntil(this.destroyed)).subscribe(this.setClosed);
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

    protected blinkToggle = (): void => {
        this.isBlink = !this.isBlink;
    };

    protected setProperties(): void {
        ViewUtil.addClass(this.container, 'vi-bottom-sheet');
        ViewUtil.toggleClass(this.container, 'vi-modal', this.config.isModal);

        if (!this.config.isModal) {
            this.container.addEventListener('click', this.mouseClickHandlerProxy, true);
            this.container.addEventListener('mousedown', this.mouseDownHandlerProxy);
        }
    }

    protected commitIsBlinkProperties(): void {}
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
        return false;
    }

    private stopBlinkIfNeed(): void {
        this.isBlink = false;
        if (!this.blinkTimer) {
            return;
        }
        clearInterval(this.blinkTimer);
        this.blinkTimer = null;
    }

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

        clearInterval(this.blinkTimer);
        this.blinkTimer = null;
    }

    public blink(): void {
        clearInterval(this.blinkTimer);
        this.blinkTimer = setInterval(this.blinkToggle, WindowImpl.BLINK_DELAY);
    }

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

    protected get isBlink(): boolean {
        return this._isBlink;
    }
    protected set isBlink(value: boolean) {
        if (value === this._isBlink) {
            return;
        }
        this._isBlink = value;
        this.commitIsBlinkProperties();
    }

    protected get isShaking(): boolean {
        return false;
    }
    protected set isShaking(value: boolean) {}

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