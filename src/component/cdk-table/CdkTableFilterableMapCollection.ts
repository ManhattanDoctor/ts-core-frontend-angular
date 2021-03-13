import { CdkTableDataSource } from './CdkTableDataSource';
import { FilterableDataSourceMapCollection } from '@ts-core/common/map/dataSource';
import { CdkTableColumnManager } from './column/CdkTableColumnManager';
import * as _ from 'lodash';
import { CdkTablePaginableMapCollection, SortData } from './CdkTablePaginableMapCollection';
import { ObjectUtil } from '@ts-core/common/util';
import { SortDirection } from '@angular/material';

export abstract class CdkTableFilterableMapCollection<U, V> extends FilterableDataSourceMapCollection<U, V> {
    // --------------------------------------------------------------------------
    //
    // 	Static Methods
    //
    // --------------------------------------------------------------------------

    public static getSort<U, V = any>(collection: FilterableDataSourceMapCollection<U, V>): SortData<U> {
        if (_.isNil(collection) || _.isEmpty(collection.sort)) {
            return null;
        }
        let active: keyof U = ObjectUtil.keys(collection.sort)[0];
        let direction: SortDirection = collection.sort[active] ? 'asc' : 'desc';
        return { active, direction };
    }

    public static applySortEvent<U, V = any>(item: FilterableDataSourceMapCollection<U, V>, event: SortData<U>): boolean {
        let value = undefined;
        if (event.direction === 'asc') {
            value = true;
        }
        if (event.direction === 'desc') {
            value = false;
        }

        if (value === item.sort[event.active]) {
            return false;
        }
        ObjectUtil.clear(item.sort);
        item.sort[event.active] = value;
        return true;
    }

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
            this.reload();
        }
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
