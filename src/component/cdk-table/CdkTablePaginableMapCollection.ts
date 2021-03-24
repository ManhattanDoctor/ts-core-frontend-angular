import { CdkTableDataSource } from './CdkTableDataSource';
import { PaginableDataSourceMapCollection } from '@ts-core/common/map/dataSource';
import { SortDirection } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { CdkTableColumnManager } from './column/CdkTableColumnManager';
import * as _ from 'lodash';
import { CdkTableFilterableMapCollection } from './CdkTableFilterableMapCollection';

export abstract class CdkTablePaginableMapCollection<U, V> extends PaginableDataSourceMapCollection<U, V> {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    protected _table: CdkTableDataSource<U>;
    protected _columns: CdkTableColumnManager<U>;

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected initialize(): void {
        super.initialize();
        this._table = this.getTable();
        this._columns = this.getColumnManager();
    }

    protected getTable(): CdkTableDataSource<U> {
        return new CdkTableDataSource(this);
    }

    protected getColumnManager(): CdkTableColumnManager<U> {
        return new CdkTableColumnManager(this.uidPropertyName);
    }

    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    public sortEventHandler(event: SortData<U>): void {
        if (CdkTableFilterableMapCollection.applySortEvent(this, event)) {
            this.load();
        }
    }

    public pageEventHandler(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.load();
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public clear(): void {
        super.clear();
        this.columns.clear();
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();

        if (!_.isNil(this._table)) {
            this._table.destroy();
            this._table = null;
        }
        if (!_.isNil(this._columns)) {
            this._columns.destroy();
            this._columns = null;
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

    public get columns(): CdkTableColumnManager<U> {
        return this._columns;
    }
}

export interface SortData<U> {
    active: keyof U;
    direction: SortDirection;
}
