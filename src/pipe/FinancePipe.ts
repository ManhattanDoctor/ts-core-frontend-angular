import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import numeral from 'numeral';

@Pipe({
    name: 'viFinance'
})
export class FinancePipe implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Static Properties
    //
    // --------------------------------------------------------------------------

    public static DEFAULT_FORMAT = '0,0';

    // --------------------------------------------------------------------------
    //
    //	Static Methods
    //
    // --------------------------------------------------------------------------

    public static format(value: number | string, format: string): string {
        value = Number(value);
        try {
            return numeral(value).format(format);
        } catch (error) {
            return value.toString();
        }
    }

    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform(value: number | string, format?: string, isNeedPlus: boolean = false): string {
        value = Number(value);
        if (_.isNaN(value)) {
            return '---';
        }
        if (_.isNil(format)) {
            format = FinancePipe.DEFAULT_FORMAT;
        }
        if (isNeedPlus) {
            format = '+' + format;
        }
        return FinancePipe.format(value, format);
    }
}
