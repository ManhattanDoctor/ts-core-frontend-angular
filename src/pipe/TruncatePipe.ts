import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { PrettifyPipe } from './PrettifyPipe';

@Pipe({
    name: 'viTruncate'
})
export class TruncatePipe implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform(value: any, maxLength?: number): string {
        return !_.isEmpty(value) ? _.truncate(value, { length: maxLength }) : PrettifyPipe.EMPTY_SYMBOL;
    }
}
