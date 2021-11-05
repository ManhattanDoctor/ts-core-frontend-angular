import { AfterViewInit, ElementRef, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { DestroyableContainer } from '@ts-core/common';
import { IWindow, WindowEvent } from './IWindow';
import { WindowConfig } from './WindowConfig';
import * as _ from 'lodash';

export abstract class IWindowContent<T = any> extends DestroyableContainer implements AfterViewInit {
    // --------------------------------------------------------------------------
    //
    //  Properties=
    //
    // --------------------------------------------------------------------------

    protected _window: IWindow<T>;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(public container: WindowContentContainer) {
        super();
    }

    // --------------------------------------------------------------------------
    //
    //  Private Methods
    //
    // --------------------------------------------------------------------------

    protected commitWindowProperties(): void {
        this.commitConfigProperties();
    }

    protected commitConfigProperties(): void {}

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public ngAfterViewInit(): void {
        this.emit(WindowEvent.CONTENT_READY);
    }

    public ngOnDestroy(): void {
        // do nothing, window will destroy content after closing
    }

    public blink(): void {
        if (!_.isNil(this.window)) {
            this.window.blink();
        }
    }

    public shake(): void {
        if (!_.isNil(this.window)) {
            this.window.shake();
        }
    }

    public emit(event: string): void {
        if (!_.isNil(this.window)) {
            this.window.emit(event);
        }
    }

    public close(): void {
        if (!_.isNil(this.window)) {
            this.window.close();
        }
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();

        this.window = null;
        this.container = null;
    }

    // --------------------------------------------------------------------------
    //
    //  Proxy Public Properties
    //
    // --------------------------------------------------------------------------

    public get data(): T {
        return !_.isNil(this.config) ? this.config.data : null;
    }

    public get isOnTop(): boolean {
        return !_.isNil(this.window) ? this.window.isOnTop : false;
    }

    public get isMinimized(): boolean {
        return !_.isNil(this.window) ? this.window.isMinimized : false;
    }

    public get events(): Observable<string> {
        return !_.isNil(this.window) ? this.window.events : null;
    }

    public get isDisabled(): boolean {
        return !_.isNil(this.window) ? this.window.isDisabled : false;
    }

    public set isDisabled(value: boolean) {
        if (!_.isNil(this.window)) {
            this.window.isDisabled = value;
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public get element(): ElementRef {
        if (_.isNil(this.container)) {
            return null;
        }
        return this.container instanceof ViewContainerRef ? this.container.element : this.container;
    }

    public get config(): WindowConfig<T> {
        return !_.isNil(this.window) ? this.window.config : null;
    }

    public get window(): IWindow<T> {
        return this._window;
    }
    public set window(value: IWindow<T>) {
        if (value === this._window) {
            return;
        }
        this._window = value;
        if (!_.isNil(value)) {
            this.commitWindowProperties();
        }
    }
}

export type WindowContentContainer = ElementRef | ViewContainerRef;
