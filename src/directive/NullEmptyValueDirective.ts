import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
import * as _ from 'lodash';

@Directive({
    selector: 'input[nullEmptyValue]',
    standalone: false
})
export class NullEmptyValueDirective {
    //--------------------------------------------------------------------------
    //
    //  Constructor
    //
    //--------------------------------------------------------------------------

    constructor(protected control: NgControl) {}

    //--------------------------------------------------------------------------
    //
    //  Event Listener
    //
    //--------------------------------------------------------------------------

    @HostListener('input', ['$event.target'])
    public onEvent(target: HTMLInputElement) {
        this.control.viewToModelUpdate(_.isEmpty(target.value) ? null : target.value);
    }
}
