import { Pipe, PipeTransform } from '@angular/core';
import { DateUtil } from '@ts-core/common';
import * as _ from 'lodash';
import { FinancePipe } from './FinancePipe';

@Pipe({
    name: 'viTime'
})
export class TimePipe implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Static Properties
    //
    // --------------------------------------------------------------------------

    public static DEFAULT_FORMAT = '00:00:00';

    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform(milliseconds: number | string, format?: string): string {
        milliseconds = Number(milliseconds);
        if (_.isNaN(milliseconds)) {
            return '---';
        }
        if (_.isNil(format)) {
            format = TimePipe.DEFAULT_FORMAT;
        }
        return FinancePipe.format(milliseconds / DateUtil.MILISECONDS_SECOND, format);
    }
}
