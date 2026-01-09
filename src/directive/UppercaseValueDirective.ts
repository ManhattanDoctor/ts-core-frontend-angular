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

    @HostListener('input', ['$event'])
    public onEvent(event: Event) {
        let target = event.target as HTMLInputElement;
        if (!_.isEmpty(target.value)) {
            target.value = target.value.toUpperCase();
        }
    }
}
