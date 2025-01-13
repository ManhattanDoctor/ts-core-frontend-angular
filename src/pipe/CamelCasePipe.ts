import { Pipe, PipeTransform } from '@angular/core';
import { PrettifyPipe } from './PrettifyPipe';
import * as _ from 'lodash';

@Pipe({
    name: 'viCamelCase',
    standalone: false
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
