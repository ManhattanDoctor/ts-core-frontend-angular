import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { ICdkTableColumn } from './ICdkTableColumn';

@Pipe({
    name: 'viCdkTableColumnClassName'
})
export class CdkTableColumnClassNamePipe implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform<U>(item: U, column: ICdkTableColumn<U>): string {
        return !_.isNil(column) && !_.isNil(column.className) ? (_.isString(column.className) ? column.className : column.className(item, column)) : null;
    }
}
