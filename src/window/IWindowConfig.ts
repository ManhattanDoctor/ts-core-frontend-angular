export interface IWindowConfig<T = any> {
    id: string;
    isModal: boolean;
    isExpandable: boolean;
    isResizeable: boolean;
    isMinimizable: boolean;
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

    defaultWidth: number;
    defaultMinWidth: number;
    defaultMaxWidth: number;

    defaultHeight: number;
    defaultMinHeight: number;
    defaultMaxHeight: number;

    paddingTop: number;
    paddingLeft: number;
    paddingRight: number;
    paddingBottom: number;

    data?: T;
    propertiesId: string;
    verticalAlign: WindowAlign;
    horizontalAlign: WindowAlign;
}

export enum WindowAlign {
    START = 'START',
    CENTER = 'CENTER',
    END = 'END'
}
