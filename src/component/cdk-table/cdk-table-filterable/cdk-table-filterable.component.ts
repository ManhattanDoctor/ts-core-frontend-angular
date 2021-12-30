import * as _ from 'lodash';
import { CdkTableBaseComponent } from '../CdkTableBaseComponent';
import { CdkTableFilterableMapCollection } from '../CdkTableFilterableMapCollection';
import { Component, ViewContainerRef } from '@angular/core';
import { ViewUtil } from '../../../util/ViewUtil';

@Component({
    selector: 'vi-cdk-table-filterable',
    templateUrl: 'cdk-table-filterable.component.html'
})
export class CdkTableFilterableComponent<U = any, V = any> extends CdkTableBaseComponent<CdkTableFilterableMapCollection<U, V>, U, V> {
    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(container: ViewContainerRef) {
        super();
        ViewUtil.addClasses(container, 'd-flex flex-column scroll-no');
    }
}
