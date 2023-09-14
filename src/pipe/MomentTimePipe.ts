import { Pipe, PipeTransform } from '@angular/core';
import { MomentAvailableType, MomentDatePipe } from './MomentDatePipe';
import * as _ from 'lodash';
import moment from 'moment';

@Pipe({
    name: 'viMomentTime'
})
export class MomentTimePipe implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Constants
    //
    // --------------------------------------------------------------------------

    public static DEFAULT_FORMAT = 'hh:mm:ss';

    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform(timeMilliseconds: number, format?: string): string {
        if (_.isNil(timeMilliseconds)) {
            return '---';
        }

        return moment()
            .startOf('day')
            .add(timeMilliseconds, 'milliseconds')
            .format(format || MomentTimePipe.DEFAULT_FORMAT);
    }
}
