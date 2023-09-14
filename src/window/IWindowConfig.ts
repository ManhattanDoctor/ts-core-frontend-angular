export interface IWindowConfig<T = any> {
    id: string;
    isModal: boolean;
    isExpandable: boolean;
    isResizeable: boolean;
    isMinimizable: boolean;
    isDisableClose: boolean;
    isContentDragable: boolean;

    x: number;
    y: number;
    elementMinX: number;
    elementMaxX: number;
    elementMinY: number;
    elementMaxY: number;
    elementMinWidth: number;
    elementMaxWidth: number;
    elementMinHeight: number;
    elementMaxHeight: number;

    width: string;
    defaultWidth: number;
    defaultMinWidth: number;
    defaultMaxWidth: number;

    height: string;
    defaultHeight: number;
    defaultMinHeight: number;
    defaultMaxHeight: number;

    paddingTop: number;
    paddingLeft: number;
    paddingRight: number;
    paddingBottom: number;

    propertiesId: string;
    verticalAlign: WindowAlign;
    horizontalAlign: WindowAlign;

    data?: T;
    autoFocus: string;
    restoreFocus: boolean;
    delayFocusTrap: boolean;
}

export enum WindowAlign {
    START = 'START',
    CENTER = 'CENTER',
    END = 'END'
}
