import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { ICdkTableColumn } from './ICdkTableColumn';

@Pipe({
    name: 'viCdkTableCellClassName'
})
export class CdkTableCellClassNamePipe implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform<U>(column: ICdkTableColumn<U>): string {
        return column.isMultiline ? 'text-multi-line' : 'text-one-line';
    }
}
