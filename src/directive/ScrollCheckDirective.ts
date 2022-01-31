import { Directive, ElementRef, Input, EventEmitter, Output } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { DateUtil } from '@ts-core/common/util';
import * as _ from 'lodash';
import { fromEvent } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

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
    public limitExceed: EventEmitter<boolean> = new EventEmitter();

    private _scrollLimit: number;
    private _scrollValue: number;
    private isExceedLimit: boolean = false;

    //--------------------------------------------------------------------------
    //
    //	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(element: ElementRef) {
        super();

        this._scrollValue = element.nativeElement.scrollTop;
        fromEvent(element.nativeElement, 'scroll')
            .pipe(debounceTime(DateUtil.MILISECONDS_SECOND / 10), takeUntil(this.destroyed))
            .subscribe(() => {
                this._scrollValue = element.nativeElement.scrollTop;
                this.check();
            });
    }

    //--------------------------------------------------------------------------
    //
    //	Protected Methods
    //
    //--------------------------------------------------------------------------

    protected check(): void {
        let value = this._scrollValue >= this.scrollLimit;
        if (value !== this.isExceedLimit) {
            this.isExceedLimit = value;
            this.limitExceed.emit(this.isExceedLimit);
        }
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
