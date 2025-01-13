import { Pipe, PipeTransform } from '@angular/core';
import { PrettifyPipe } from './PrettifyPipe';
import * as _ from 'lodash';

@Pipe({
    name: 'viTruncate',
    standalone: false
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
