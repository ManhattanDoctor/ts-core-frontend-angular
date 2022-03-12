import * as _ from 'lodash';
import { CdkTableBaseComponent } from '../CdkTableBaseComponent';
import { Component, ViewContainerRef } from '@angular/core';
import { ViewUtil } from '../../../util/ViewUtil';
import { CdkTablePaginableBookmarkMapCollection } from '../CdkTablePaginableBookmarkMapCollection';

@Component({
    selector: 'vi-cdk-table-paginable-bookmark',
    templateUrl: 'cdk-table-paginable-bookmark.component.html'
})
export class CdkTablePaginableBookmarkComponent<U = any, V = any> extends CdkTableBaseComponent<CdkTablePaginableBookmarkMapCollection<U, V>, U, V> {
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
