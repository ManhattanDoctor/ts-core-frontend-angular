import { Pipe, PipeTransform } from '@angular/core';
import { PrettifyPipe } from './PrettifyPipe';
import * as _ from 'lodash';

@Pipe({
    name: 'viStartCase',
    standalone: false
})
export class StartCasePipe implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform(value: any): string {
        return !_.isEmpty(value) ? value.charAt(0).toUpperCase() + value.slice(1) : PrettifyPipe.EMPTY_SYMBOL;
    }
}
