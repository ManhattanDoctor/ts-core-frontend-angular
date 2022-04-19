import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { ICdkTableColumn } from '../column/ICdkTableColumn';

@Pipe({
    name: 'viCdkTableCellStyleName'
})
export class CdkTableCellStyleNamePipe implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform<U>(item: U, column: ICdkTableColumn<U>): { [key: string]: any } {
        return !_.isNil(column) && !_.isNil(column.cellStyleName) ? column.cellStyleName(item, column) : null;
    }
}
