import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
    name: 'viStartCase'
})
export class StartCasePipe implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    // 	Static Methods
    //
    // --------------------------------------------------------------------------

    public static transform(value: any): string {
        return !_.isEmpty(value) ? value.charAt(0).toUpperCase() + value.slice(1) : null;
    }
    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform(value: any): string {
        return StartCasePipe.transform(value);
    }
}
