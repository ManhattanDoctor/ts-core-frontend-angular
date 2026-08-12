import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
    name: 'viTruncate'
})
export class TruncatePipe implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Static Methods
    //
    // --------------------------------------------------------------------------

    public static transform(value: any, maxLength?: number): string {
        return !_.isEmpty(value) ? _.truncate(value, { length: maxLength }) : null;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform(value: any, maxLength?: number): string {
        return TruncatePipe.transform(value, maxLength);
    }
}
