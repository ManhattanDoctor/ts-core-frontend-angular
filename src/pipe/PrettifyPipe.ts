import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
    name: 'viPrettify',
    standalone: false
})
export class PrettifyPipe implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    // 	Static Properties
    //
    // --------------------------------------------------------------------------

    public static EMPTY_SYMBOL = '-';

    // --------------------------------------------------------------------------
    //
    // 	Static Methods
    //
    // --------------------------------------------------------------------------

    public static transform(value: any): string {
        let isNil = _.isNil(value);
        if (!isNil && !_.isNumber(value)) {
            isNil = _.isEmpty(value);
        }
        return !isNil ? value : PrettifyPipe.EMPTY_SYMBOL;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform(value: any): string {
        return PrettifyPipe.transform(value);
    }
}
