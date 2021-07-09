export interface ICdkTableRow<U = any> {
    className?: ICdkTableRowClassNameFunction<U> | string;
    styleName?: ICdkTableRowStyleNameFunction<U>;
}

export type ICdkTableRowClassNameFunction<U> = (item: U, selectedItems: Array<U>) => string;
export type ICdkTableRowStyleNameFunction<U> = (item: U, selectedItems: Array<U>) => { [key: string]: string };
