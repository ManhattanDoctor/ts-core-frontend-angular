import { Directive, ElementRef, EventEmitter, Input, Output, booleanAttribute } from '@angular/core';
import { Interactable } from '@interactjs/types';
import * as interact from 'interactjs';
import { Destroyable } from '@ts-core/common';
import { ViewUtil } from '../util/ViewUtil';
import * as _ from 'lodash';

@Directive({
    selector: '[vi-resize]',
    standalone: false
})
export class ResizeDirective extends Destroyable {
    // --------------------------------------------------------------------------
    //
    //	Properties
    //
    // --------------------------------------------------------------------------

    @Output()
    public resized: EventEmitter<any> = new EventEmitter();

    @Input({ transform: booleanAttribute })
    public isTop: boolean = false;
    @Input({ transform: booleanAttribute })
    public isLeft: boolean = false;
    @Input({ transform: booleanAttribute })
    public isRight: boolean = false;
    @Input({ transform: booleanAttribute })
    public isBottom: boolean = false;

    private interactable: Interactable;

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(element: ElementRef) {
        super();

        this.interactable = interact.default(ViewUtil.parseElement(element));
        // this.interactable.styleCursor(false);

        let param = {} as any;
        param.top = this.isTop;
        param.left = this.isLeft;
        param.right = this.isRight;
        param.bottom = this.isBottom;
        this.interactable.resizable(param);
        this.interactable.on('resizemove', this.resizeHandler);
    }

    // --------------------------------------------------------------------------
    //
    //  Event Handlers
    //
    // --------------------------------------------------------------------------

    private resizeHandler = (event: any) => {
        if (event.dx !== 0 || event.dy !== 0) {
            this.resized.emit(event);
        }
    };

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

        if (!_.isNil(this.interactable)) {
            this.interactable.unset();
            this.interactable = null;
        }
    }
}
