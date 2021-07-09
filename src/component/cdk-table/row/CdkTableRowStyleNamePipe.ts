import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { ICdkTableSettings } from '../CdkTableBaseComponent';
import { ICdkTableRow } from './ICdkTableRow';

@Pipe({
    name: 'viCdkTableRowStyleName'
})
export class CdkTableRowStyleNamePipe implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform<U>(item: U, row: ICdkTableRow<U>, selectedRows: Array<U>, isInteractive?: boolean): { [key: string]: any } {
        return !_.isNil(row) && !_.isNil(row.styleName) ? row.styleName(item, selectedRows) : null;
    }
}
