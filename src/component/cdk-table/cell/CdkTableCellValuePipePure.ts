import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { CdkTableCellValue, ICdkTableColumn } from '../column/ICdkTableColumn';

@Pipe({
    name: 'viCdkTableCellValuePure'
})
export class CdkTableCellValuePipePure implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform<U>(item: U, column: ICdkTableColumn<U>): CdkTableCellValue<U> {
        return !_.isNil(column.format) ? column.format(item, column) : item[column.name];
    }
}
