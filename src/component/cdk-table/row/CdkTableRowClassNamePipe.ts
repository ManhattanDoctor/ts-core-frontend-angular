import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { ICdkTableSettings } from '../CdkTableBaseComponent';
import { ICdkTableRow } from './ICdkTableRow';

@Pipe({
    name: 'viCdkTableRowClassName'
})
export class CdkTableRowClassNamePipe implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform<U>(item: U, row: ICdkTableRow<U>, selectedRows: Array<U>): string {
        return !_.isNil(row) && !_.isNil(row.className) ? (_.isString(row.className) ? row.className : row.className(item, selectedRows)) : null;
    }
}
