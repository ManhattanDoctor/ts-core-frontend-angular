import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
import * as _ from 'lodash';

@Pipe({
    name: 'viMomentTime',
    standalone: false
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
    //	Static Methods
    //
    // --------------------------------------------------------------------------

    public static transform(timeMilliseconds: number, format?: string): string {
        if (_.isNil(timeMilliseconds)) {
            return '---';
        }
        return moment()
            .startOf('day')
            .add(timeMilliseconds, 'milliseconds')
            .format(format || MomentTimePipe.DEFAULT_FORMAT);
    }

    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform(timeMilliseconds: number, format?: string): string {
        return MomentTimePipe.transform(timeMilliseconds, format);
    }
}
