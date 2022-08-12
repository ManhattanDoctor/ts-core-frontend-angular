import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import * as _ from 'lodash';
import { CdkTableCellValue, ICdkTableColumn } from '../column/ICdkTableColumn';

@Pipe({
    name: 'viCdkTableCellValue',
    pure: false
})
export class CdkTableCellValuePipe<U> extends DestroyableContainer implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    // 	Static Properties
    //
    // --------------------------------------------------------------------------

    public static ERROR_SYMBOL = 'x';
    public static PENDING_SYMBOL = '⧗';

    // --------------------------------------------------------------------------
    //
    //	Properties
    //
    // --------------------------------------------------------------------------

    private lastItem: U;
    private lastColumn: ICdkTableColumn<U>;

    private lastValue: CdkTableCellValue<U>;

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private detection: ChangeDetectorRef) {
        super();
    }

    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform(item: U, column: ICdkTableColumn<U>): CdkTableCellValue<U> | Promise<CdkTableCellValue<U>> {
        if (item === this.lastItem && column === this.lastColumn) {
            return this.lastValue;
        }

        if (_.isNil(column.format)) {
            this.lastValue = item[column.name];
            return this.lastValue;
        }

        this.lastItem = item;
        this.lastColumn = column;

        this.lastValue = CdkTableCellValuePipe.PENDING_SYMBOL;

        let result = column.format(item, column);
        if (!(result instanceof Promise)) {
            this.lastValue = result;
            return this.lastValue;
        }

        result
            .then(item => {
                this.lastValue = item;
            })
            .catch(error => {
                this.lastValue = CdkTableCellValuePipe.ERROR_SYMBOL;
            })
            .finally(() => {
                if (!_.isNil(this.detection)) {
                    this.detection.markForCheck();
                }
            });
        return this.lastValue;
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.detection = null;

        this.lastItem = null;
        this.lastColumn = null;

        this.lastValue = null;
    }
}
