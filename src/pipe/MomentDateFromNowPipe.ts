import { Pipe, PipeTransform } from '@angular/core';
import { Moment } from 'moment';
import { MomentDatePipe } from './MomentDatePipe';

@Pipe({
    name: 'viMomentDateFromNow',
    standalone: false
})
export class MomentDateFromNowPipe implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Static Methods
    //
    // --------------------------------------------------------------------------

    public static transform(value: Date | Moment, format?: string): string {
        return MomentDatePipe.fromNow(value, format);
    }

    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform(value: Date | Moment, format?: string): string {
        return MomentDateFromNowPipe.transform(value, format);
    }
}
