import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
    name: 'viCamelCase'
})
export class CamelCasePipe implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    // 	Static Methods
    //
    // --------------------------------------------------------------------------

    public static transform(value: any): string {
        return !_.isNil(value) ? _.camelCase(value) : null;
    }
    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform(value: any): string {
        return CamelCasePipe.transform(value);
    }
}
