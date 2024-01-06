import { Directive, ElementRef, Input, EventEmitter, Output } from '@angular/core';
import { DateUtil, DestroyableContainer } from '@ts-core/common';
import { fromEvent, debounceTime, takeUntil } from 'rxjs';
import * as _ from 'lodash';

@Directive({
    selector: '[vi-scroll-check]'
})
export class ScrollCheckDirective extends DestroyableContainer {
    //--------------------------------------------------------------------------
    //
    //	Properties
    //
    //--------------------------------------------------------------------------

    @Output()
    public top: EventEmitter<boolean> = new EventEmitter();
    @Output()
    public bottom: EventEmitter<boolean> = new EventEmitter();
    @Output()
    public limitExceed: EventEmitter<boolean> = new EventEmitter();

    private _scrollLimit: number;

    private element: HTMLElement;
    private isExceedLimit: boolean = false;

    @Input()
    public delay: number = DateUtil.MILLISECONDS_SECOND / 10;
    @Input()
    public offset: number = 50;

    //--------------------------------------------------------------------------
    //
    //	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(element: ElementRef) {
        super();
        this.delay = DateUtil.MILLISECONDS_SECOND / 10;
        this.element = element.nativeElement;

        fromEvent(this.element, 'scroll').pipe(debounceTime(this.delay), takeUntil(this.destroyed)).subscribe(this.check);
    }

    //--------------------------------------------------------------------------
    //
    //	Protected Methods
    //
    //--------------------------------------------------------------------------

    protected check = (): void => {
        let value = this.scrollValue >= this.scrollLimit;
        if (value !== this.isExceedLimit) {
            this.isExceedLimit = value;
            this.limitExceed.emit(value);
        }

        let offset = !_.isNaN(this.offset) ? this.offset : 0;
        value = this.scrollValue + this.clientHeight + offset >= this.scrollHeight;
        this.bottom.next(value);

        value = this.scrollValue <= offset;
        this.top.next(value);
    };

    //--------------------------------------------------------------------------
    //
    //	Private Properties
    //
    //--------------------------------------------------------------------------

    // --------------------------------------------------------------------------
    //
    //	Private Properties
    //
    // --------------------------------------------------------------------------

    protected get scrollValue(): number {
        return this.element.scrollTop;
    }
    protected get scrollHeight() {
        return this.element.scrollHeight;
    }
    protected get clientHeight(): number {
        return this.element.clientHeight;
    }

    //--------------------------------------------------------------------------
    //
    //	Public Properties
    //
    //--------------------------------------------------------------------------

    @Input('vi-scroll-check')
    public set scrollLimit(value: number) {
        if (value == this._scrollLimit) {
            return;
        }
        this._scrollLimit = value;
        this.check();
    }
    public get scrollLimit(): number {
        return this._scrollLimit;
    }
}
