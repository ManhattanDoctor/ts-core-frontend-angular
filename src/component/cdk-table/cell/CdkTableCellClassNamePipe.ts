import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { ICdkTableColumn } from '../column/ICdkTableColumn';

@Pipe({
    name: 'viCdkTableCellClassName'
})
export class CdkTableCellClassNamePipe implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform<U>(item: U, column: ICdkTableColumn<U>): string {
        if (_.isNil(column.cellClassName)) {
            return column.isMultiline ? 'text-multi-line' : 'text-one-line';
        }
        return _.isString(column.cellClassName) ? column.cellClassName : column.cellClassName(item, column);
    }
}
