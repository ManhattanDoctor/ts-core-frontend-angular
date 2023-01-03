import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { PrettifyPipe } from './PrettifyPipe';

@Pipe({
    name: 'viCamelCase'
})
export class CamelCasePipe implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform(value: any): string {
        return !_.isNil(value) ? _.camelCase(value) : PrettifyPipe.EMPTY_SYMBOL;
    }
}
