import { PaginableBookmarkDataSourceMapCollection } from '@ts-core/common';
import { CdkTableDataSource } from './CdkTableDataSource';
import * as _ from 'lodash';
import { CdkTableFilterableMapCollection } from './CdkTableFilterableMapCollection';
import { Sort } from '@angular/material/sort';

export abstract class CdkTablePaginableBookmarkMapCollection<U, V> extends PaginableBookmarkDataSourceMapCollection<U, V> {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    protected _table: CdkTableDataSource<U>;

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected initialize(): void {
        super.initialize();
        this._table = this.getTable();
    }

    protected getTable(): CdkTableDataSource<U> {
        return new CdkTableDataSource(this);
    }

    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    public sortEventHandler(event: Sort): void {
        if (CdkTableFilterableMapCollection.applySortEvent(this, event)) {
            this.reload();
        }
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public destroy(): void {
        super.destroy();
        if (!_.isNil(this._table)) {
            this._table.destroy();
            this._table = null;
        }
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get table(): CdkTableDataSource<U> {
        return this._table;
    }
}
