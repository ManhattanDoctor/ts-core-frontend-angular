export interface ICdkTableColumn<U = any> {
    name: string;

    className?: ICdkTableColumnClassNameFunction<U> | string;
    styleName?: ICdkTableColumnStyleNameFunction<U>;

    format?: ICdkTableCellValueFunction<U>;
    cellStyleName?: ICdkTableColumnStyleNameFunction<U>;
    cellClassName?: ICdkTableCellClassNameFunction<U> | string;

    headerId?: string;
    headerClassName?: string;
    headerStyleName?: string;

    isImage?: boolean;
    isAsync?: boolean;
    isMultiline?: boolean;
    isDisableSort?: boolean;
}

export type CdkTableCellValue<U = any> = string | number | U[keyof U];

export type ICdkTableCellValueFunction<U> = (item: U, column: ICdkTableColumn<U>) => CdkTableCellValue<U> | Promise<CdkTableCellValue<U>>;
export type ICdkTableCellClassNameFunction<U> = (item: U, column: ICdkTableColumn<U>) => string;
export type ICdkTableCellStyleNameFunction<U> = (item: U, column: ICdkTableColumn<U>) => { [key: string]: any };

export type ICdkTableColumnClassNameFunction<U> = (item: U, column: ICdkTableColumn<U>) => string;
export type ICdkTableColumnStyleNameFunction<U> = (item: U, column: ICdkTableColumn<U>) => { [key: string]: any };
