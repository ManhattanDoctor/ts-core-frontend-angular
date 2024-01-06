import { Directive, EventEmitter, ElementRef, HostListener, Input, Output } from '@angular/core';
import { Destroyable } from '@ts-core/common';
import * as _ from 'lodash';
import { ViewUtil } from '../public-api';

@Directive({
    selector: '[vi-scroll]'
})
export class ScrollDirective extends Destroyable {
    // --------------------------------------------------------------------------
    //
    //	Static Properties
    //
    // --------------------------------------------------------------------------

    public static INITIALIZATION_DELAY: number = 1;

    // --------------------------------------------------------------------------
    //
    //	Properties
    //
    // --------------------------------------------------------------------------

    @Output()
    public scrolled: EventEmitter<number> = new EventEmitter();

    private timer: any;
    protected element: HTMLElement;
    protected isInitialized: boolean = false;

    protected _scrollValue: number = 0;

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(element: ElementRef) {
        super();
        this.element = ViewUtil.parseElement(element);
        this.timer = setTimeout(this.initializeHandler, ScrollDirective.INITIALIZATION_DELAY);
    }

    // --------------------------------------------------------------------------
    //
    //	Private Methods
    //
    // --------------------------------------------------------------------------

    protected initialize(): void {
        if (!_.isNil(this.scrollValue)) {
            this.scrollTo(this.scrollValue);
        }
        this.isInitialized = true;
    }

    protected scrollTo(value: number, behavior?: ScrollBehavior): void {
        this._scrollValue = value;
        this.element.scroll({ top: value, behavior });
    }

    // --------------------------------------------------------------------------
    //
    //	Event Handlers
    //
    // --------------------------------------------------------------------------

    @HostListener('scroll')
    public scrollHandler() {
        if (this.isInitialized) {
            this.scrollChangedHandler();
        }
    }

    protected scrollChangedHandler(): void {
        this._scrollValue = this.scrollTop;
        this.scrolled.next(this._scrollValue);
    }

    protected initializeHandler = (): void => this.initialize();

    // --------------------------------------------------------------------------
    //
    //	Private Properties
    //
    // --------------------------------------------------------------------------

    protected get scrollTop(): number {
        return this.element.scrollTop;
    }

    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();

        this.element = null;
        this.isInitialized = false;

        clearTimeout(this.timer);
        this.timer = null;

        this._scrollValue = 0;
    }

    // --------------------------------------------------------------------------
    //
    //	Public Properties
    //
    // --------------------------------------------------------------------------

    @Input()
    public set scrollValue(value: number) {
        if (value === this._scrollValue || _.isNaN(value)) {
            return;
        }
        this._scrollValue = value;
        if (this.isInitialized) {
            this.scrollTo(value);
        }
    }

    public get scrollValue(): number {
        return this._scrollValue;
    }
}
