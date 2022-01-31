import { Component, EventEmitter, Injectable, Input, Output } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import * as _ from 'lodash';
import { ICdkTableRow } from './row/ICdkTableRow';
import { ICdkTableColumn } from './column/ICdkTableColumn';
import { CdkTablePaginableMapCollection } from './CdkTablePaginableMapCollection';
import { CdkTableFilterableMapCollection } from './CdkTableFilterableMapCollection';
import { SortDirection } from '@angular/material/sort';
import { FilterableDataSourceMapCollection } from '@ts-core/common/map/dataSource';

@Component({ template: '' })
export abstract class CdkTableBaseComponent<
    T extends CdkTablePaginableMapCollection<U, V> | CdkTableFilterableMapCollection<U, V>,
    U,
    V
> extends DestroyableContainer {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    protected _table: T;
    protected _settings: ICdkTableSettings<U>;
    protected _rows: ICdkTableRow<U>;
    protected _columns: Array<ICdkTableColumn<U>>;
    protected _columnNames: Array<keyof U>;

    protected _selectedRow: U;
    protected _selectedRows: Array<U>;

    @Output()
    public rowClicked: EventEmitter<U>;
    @Output()
    public cellClicked: EventEmitter<ICdkTableCellEvent<U>>;

    public sortActive: string;
    public sortDirection: SortDirection;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super();

        this._columnNames = [];

        this.settings = {};
        this.rowClicked = new EventEmitter();
        this.cellClicked = new EventEmitter();
    }

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected commitTableProperties(): void {
        let sort = CdkTableFilterableMapCollection.getSort(this.table as FilterableDataSourceMapCollection<U, V>);
        if (!_.isNil(sort)) {
            this.sortActive = sort.active.toString();
            this.sortDirection = sort.direction;
        }

        if (!this.table.isDirty) {
            this.table.reload();
        }
    }

    protected commitColumnsProperties(): void {
        let value = null;

        value = !_.isEmpty(this.columns) ? this.columns.map(item => item.name) : [];
        if (value !== this._columnNames) {
            this._columnNames = value;
        }
    }

    protected commitSelectedRowsProperties(): void {
        this._selectedRow = !_.isEmpty(this.selectedRows) && this.selectedRows.length === 1 ? this.selectedRows[0] : null;
    }

    protected commitSettingsProperties(): void {
        if (_.isNil(this.settings.noDataId)) {
            this.settings.noDataId = 'general.noDataFound';
        }
        if (_.isNil(this.settings.isInteractive)) {
            this.settings.isInteractive = true;
        }
        if (_.isNil(this.rows) && !_.isEmpty(this.settings.rows)) {
            this.rows = this.settings.rows;
        }
        if (_.isNil(this.columns) && !_.isEmpty(this.settings.columns)) {
            this.columns = this.settings.columns;
        }
    }

    protected commitRowProperties(): void {}

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public columnTrackBy(index: number, item: ICdkTableColumn<U>): string {
        return item.name;
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();

        this.table = null;
        this.selectedRows = null;

        if (!_.isNil(this.cellClicked)) {
            this.cellClicked.complete();
            this.cellClicked = null;
        }
        if (!_.isNil(this.rowClicked)) {
            this.rowClicked.complete();
            this.rowClicked = null;
        }
    }

    //--------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    //--------------------------------------------------------------------------

    public cellClickHandler(item: U, column: ICdkTableColumn<U>): void {
        this.cellClicked.emit({ data: item, column: column.name });
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get table(): T {
        return this._table;
    }
    @Input()
    public set table(value: T) {
        if (value === this._table) {
            return;
        }
        this._table = value;
        if (!_.isNil(value)) {
            this.commitTableProperties();
        }
    }

    public get selectedRows(): Array<U> {
        return this._selectedRows;
    }
    @Input()
    public set selectedRows(value: Array<U>) {
        if (value === this._selectedRows) {
            return;
        }
        this._selectedRows = value;
        this.commitSelectedRowsProperties();
    }

    public get selectedRow(): U {
        return this._selectedRow;
    }
    @Input()
    public set selectedRow(value: U) {
        if (value === this._selectedRow) {
            return;
        }
        this.selectedRows = !_.isNil(value) ? [value] : [];
    }

    public get rows(): ICdkTableRow<U> {
        return this._rows;
    }
    @Input()
    public set rows(value: ICdkTableRow<U>) {
        if (value === this._rows) {
            return;
        }
        this._rows = value;
        if (!_.isNil(value)) {
            this.commitRowProperties();
        }
    }

    public get columns(): Array<ICdkTableColumn<U>> {
        return this._columns;
    }
    @Input()
    public set columns(value: Array<ICdkTableColumn<U>>) {
        if (value === this._columns) {
            return;
        }
        this._columns = value;
        if (!_.isNil(value)) {
            this.commitColumnsProperties();
        }
    }

    public get settings(): ICdkTableSettings<U> {
        return this._settings;
    }
    @Input()
    public set settings(value: ICdkTableSettings<U>) {
        if (value === this._settings) {
            return;
        }
        this._settings = value;
        if (!_.isNil(value)) {
            this.commitSettingsProperties();
        }
    }

    public get columnNames(): Array<keyof U> {
        return this._columnNames;
    }
}

export interface ICdkTableCellEvent<U> {
    data: U;
    column: string;
}

export interface ICdkTableSettings<U> {
    noDataId?: string;
    isInteractive?: boolean;

    rows?: ICdkTableRow<U>;
    columns?: Array<ICdkTableColumn<U>>;
}
