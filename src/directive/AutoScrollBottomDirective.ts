import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { InfiniteScrollDirective } from './InfiniteScrollDirective';
import * as _ from 'lodash';

@Directive({
    selector: '[vi-auto-scroll-bottom]'
})
export class AutoScrollBottomDirective extends InfiniteScrollDirective {
    // --------------------------------------------------------------------------
    //
    //	Properties
    //
    // --------------------------------------------------------------------------

    @Input()
    public behavior: ScrollBehavior = 'auto';

    @Output()
    public triggerChanged: EventEmitter<number> = new EventEmitter<number>();

    private _trigger: any;
    private triggerTimer: any;
    private triggerDelta: number = 0;

    private isScrollLocked: boolean = false;
    private lastScrollHeight: number;

    private isNeedScroll: boolean = true;
    private isNeedRemainScroll: boolean = false;

    // --------------------------------------------------------------------------
    //
    //	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected initialize(): void {
        if (!_.isNil(this.scrollHeight)) {
            this._scrollValue = this.scrollHeight;
        }
        super.initialize();
    }

    protected checkTrigger = () => {
        this.isScrollLocked = false;
        if (this.isNeedScroll) {
            this.scrollBottom();
        } else if (this.isNeedRemainScroll) {
            this.scrollRemain();
        } else if (this.triggerDelta > 0) {
            this.triggerChanged.emit(this.triggerDelta);
            this.triggerDelta = 0;
        }
    };

    protected scrollRemain(): void {
        this.isNeedRemainScroll = false;
        this.scrollTo(this.scrollHeight - this.lastScrollHeight);
    }

    // --------------------------------------------------------------------------
    //
    //	Event Handlers
    //
    // --------------------------------------------------------------------------

    protected scrollChangedHandler() {
        super.scrollChangedHandler();
        if (!this.isInitialized || this.isScrollLocked) {
            return;
        }

        let value = this.scrollTop;
        let bottomValue = value + this.clientHeight + this.elementHeight;

        this.isNeedScroll = bottomValue >= this.scrollHeight;
        this.isNeedRemainScroll = value <= this.elementHeight;

        if (this.isNeedRemainScroll) {
            this.lastScrollHeight = this.scrollHeight;
        }
    }

    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public scrollCheck(): void {
        clearTimeout(this.triggerTimer);
        this.triggerTimer = setTimeout(this.checkTrigger, InfiniteScrollDirective.INITIALIZATION_DELAY);
    }

    public scrollBottom(): void {
        this.scrollTo(this.scrollHeight, this.behavior);
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();

        clearTimeout(this.triggerTimer);
        this.triggerTimer = null;
        this.trigger = null;
    }

    // --------------------------------------------------------------------------
    //
    //	Public Properties
    //
    // --------------------------------------------------------------------------

    @Input('vi-auto-scroll-bottom')
    public set trigger(value: number) {
        if (value === this._trigger) {
            return;
        }
        if (!isNaN(this._trigger) && !isNaN(value)) {
            this.triggerDelta = value - this._trigger;
        }

        this._trigger = value;
        if (!this.isInitialized) {
            return;
        }
        this.isScrollLocked = true;
        this.scrollCheck();
    }
}
