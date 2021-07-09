import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { Moment } from 'moment';
import moment from 'moment';
import { GetFilterableCondition, RemoveFilterableCondition } from '@ts-core/common/dto';

@Pipe({
    name: 'viMomentDate'
})
export class MomentDatePipe implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Constants
    //
    // --------------------------------------------------------------------------

    public static DEFAULT_FORMAT = 'LLL';

    // --------------------------------------------------------------------------
    //
    //	Static Methods
    //
    // --------------------------------------------------------------------------

    public static parseMoment(value: MomentAvailableType, format?: string): Moment {
        if (_.isDate(value)) {
            return moment(value);
        }
        if (_.isString(value)) {
            return moment(value, format);
        }
        if (_.isNumber(value)) {
            return moment().milliseconds(value);
        }
        return value as Moment;
    }

    public static fromNow(value: MomentAvailableType, format: string = 'LLL'): string {
        if (_.isNil(value)) {
            return '---';
        }

        let item = MomentDatePipe.parseMoment(value);
        let date = item.fromNow();
        date = date.charAt(0).toUpperCase() + date.slice(1);
        if (!_.isNil(format)) {
            date += ' (' + item.format(format) + ')';
        }
        return date;
    }

    public static toConditionValue(value: string | Date): string {
        if (_.isNil(value)) {
            return undefined;
        }
        value = value.toString();
        let item = MomentDatePipe.parseMoment(RemoveFilterableCondition(value));
        return item.isValid() ? `${GetFilterableCondition(value) || '='}${item.toDate().toString()}` : undefined;
    }

    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform(value: MomentAvailableType, format?: string): string {
        if (_.isNil(value)) {
            return '---';
        }

        let moment = MomentDatePipe.parseMoment(value);
        return moment.format(format || MomentDatePipe.DEFAULT_FORMAT);
    }
}
export type MomentAvailableType = Date | Moment | string | number;
