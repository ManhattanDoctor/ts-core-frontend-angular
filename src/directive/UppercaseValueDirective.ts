import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
import * as _ from 'lodash';

@Directive({
    standalone: false,
    selector: 'input[uppercaseValue]'
})
export class UppercaseValueDirective {
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
        let { value } = target;
        if (!_.isEmpty(value)) {
            target.value = value.toUpperCase();
        }
    }
}
