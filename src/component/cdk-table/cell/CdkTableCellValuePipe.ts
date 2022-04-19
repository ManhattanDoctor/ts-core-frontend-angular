import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { ICdkTableColumn } from '../column/ICdkTableColumn';

@Pipe({
    name: 'viCdkTableCellValue'
})
export class CdkTableCellValuePipe implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform<U>(item: U, column: ICdkTableColumn<U>): string | number | U[keyof U] {
        return !_.isNil(column) && !_.isNil(column.format) ? column.format(item, column) : item[column.name];
    }
}
