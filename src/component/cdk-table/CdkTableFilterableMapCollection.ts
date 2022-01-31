import { CdkTableDataSource } from './CdkTableDataSource';
import { FilterableDataSourceMapCollection } from '@ts-core/common/map/dataSource';
import * as _ from 'lodash';
import { ObjectUtil } from '@ts-core/common/util';
import { Sort, SortDirection } from '@angular/material/sort';

export abstract class CdkTableFilterableMapCollection<U, V> extends FilterableDataSourceMapCollection<U, V> {
    // --------------------------------------------------------------------------
    //
    // 	Static Methods
    //
    // --------------------------------------------------------------------------

    public static getSort<U, V = any>(collection: FilterableDataSourceMapCollection<U, V>): Sort {
        if (_.isNil(collection) || _.isEmpty(collection.sort)) {
            return null;
        }
        let active = ObjectUtil.keys(collection.sort)[0].toString();
        let direction: SortDirection = collection.sort[active] ? 'asc' : 'desc';
        return { active, direction };
    }

    public static applySortEvent<U, V = any>(item: FilterableDataSourceMapCollection<U, V>, event: Sort): boolean {
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

    protected sortFunction(first: U, second: U, event: Sort): number {
        if (_.isEmpty(event.direction)) {
            return 0;
        }
        let firstValue = first[event.active];
        let secondValue = second[event.active];
        let isHigher = firstValue > secondValue;
        if (event.direction === 'asc') {
            return isHigher ? -1 : 1;
        } else {
            return isHigher ? 1 : -1;
        }
    }
    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
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
