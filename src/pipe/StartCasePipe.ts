import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { PrettifyPipe } from './PrettifyPipe';

@Pipe({
    name: 'viStartCase'
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
