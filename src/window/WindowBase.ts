import * as _ from 'lodash';
import { DestroyableContainer } from '@ts-core/common';
import { IWindowConfig, WindowAlign } from './IWindowConfig';
import { ViewUtil } from '../util/ViewUtil';

export abstract class WindowBase<T = any> extends DestroyableContainer {
    // --------------------------------------------------------------------------
    //
    // 	Static Methods
    //
    // --------------------------------------------------------------------------

    protected static parseX<T>(value: number, config: IWindowConfig<T>): number {
        value = Math.max(value, config.elementMinX);
        value = Math.min(value, config.elementMaxX);
        return value;
    }

    protected static parseY<T>(value: number, config: IWindowConfig<T>): number {
        value = Math.max(value, config.elementMinY);
        value = Math.min(value, config.elementMaxY);
        return value;
    }

    protected static parseWidth<T>(value: number, config: IWindowConfig<T>): number {
        value = Math.max(value, config.elementMinWidth);
        value = Math.min(value, config.elementMaxWidth);
        return value;
    }

    protected static parseHeight<T>(value: number, config: IWindowConfig<T>): number {
        value = Math.max(value, config.elementMinHeight);
        value = Math.min(value, config.elementMaxHeight);
        return value;
    }

    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    protected _x: number = NaN;
    protected _width: number = NaN;

    protected _y: number = NaN;
    protected _height: number = NaN;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super();
    }

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected abstract getConfig(): IWindowConfig<T>;
    protected abstract getContainer(): HTMLElement;

    protected setProperties(): void {
        let config = this.getConfig();
        if (!_.isNaN(config.defaultWidth)) {
            this.width = config.defaultWidth;
        }
        if (!_.isNaN(config.defaultHeight)) {
            this.height = config.defaultHeight;
        }
    }

    protected setPosition(): void {
        let config = this.getConfig();

        switch (config.horizontalAlign) {
            case WindowAlign.START:
                this.x = !_.isNaN(this.paddingLeft) ? this.paddingLeft : 0;
                break;
            case WindowAlign.END:
                let value = ViewUtil.getStageWidth() - this.calculateWidth();
                if (!_.isNaN(this.paddingRight)) {
                    value -= this.paddingRight;
                }
                this.x = value;
                break;
            default:
                this.x = (ViewUtil.getStageWidth() - this.calculateWidth()) / 2;
                break;
        }

        switch (config.verticalAlign) {
            case WindowAlign.START:
                this.y = !_.isNaN(this.paddingTop) ? this.paddingTop : 0;
                break;
            case WindowAlign.END:
                let value = ViewUtil.getStageHeight() - this.calculateHeight();
                if (!_.isNaN(this.paddingBottom)) {
                    value -= this.paddingBottom;
                }
                this.y = value;
                break;
            default:
                this.y = (ViewUtil.getStageHeight() - this.calculateHeight()) / 2;
                break;
        }
    }

    protected clearSize(): void {
        this._x = NaN;
        this._y = NaN;
        this._width = NaN;
        this._height = NaN;
    }

    protected commitSizeProperties(): void {
        /*
        let width = !_.isNaN(this.width) ? `${this.width}px` : 'auto';
        let height = !_.isNaN(this.height) ? `${this.height}px` : 'auto';
        this.getReference().updateSize(width, height);
        */
    }

    protected commitPositionProperties(): void {
        /*
        if (_.isNaN(this._x) && _.isNaN(this._y)) {
            return;
        }
        let position = {} as any;
        if (!_.isNaN(this._y)) {
            position.top = `${this._y}px`;
        }
        if (!_.isNaN(this._x)) {
            position.left = `${this._x}px`;
        }
        this.getReference().updatePosition(position);
        */
    }

    protected updatePosition = (): void => this.setPosition();

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public calculateWidth(): number {
        return !_.isNaN(this.width) ? this.width : ViewUtil.getWidth(this.getContainer());
    }
    public calculateHeight(): number {
        return !_.isNaN(this.height) ? this.height : ViewUtil.getHeight(this.getContainer());
    }

    // --------------------------------------------------------------------------
    //
    // 	Private Properties
    //
    // --------------------------------------------------------------------------

    protected get width(): number {
        return this._width;
    }
    protected set width(value: number) {
        value = WindowBase.parseWidth(value, this.getConfig());
        if (value === this._width) {
            return;
        }
        this._width = value;
        this.commitSizeProperties();
    }

    protected get height(): number {
        return this._height;
    }
    protected set height(value: number) {
        value = WindowBase.parseWidth(value, this.getConfig());
        if (value === this._height) {
            return;
        }
        this._height = value;
        this.commitSizeProperties();
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get x(): number {
        return this._x;
    }

    public set x(value: number) {
        value = WindowBase.parseX(value, this.getConfig());
        if (value === this._x) {
            return;
        }
        this._x = value;
        this.commitPositionProperties();
    }

    public get y(): number {
        return this._y;
    }

    public set y(value: number) {
        value = WindowBase.parseY(value, this.getConfig());
        if (value === this._y) {
            return;
        }
        this._y = value;
        this.commitPositionProperties();
    }

    public get paddingTop(): number {
        return this.getConfig().paddingTop;
    }

    public get paddingLeft(): number {
        return this.getConfig().paddingLeft;
    }

    public get paddingRight(): number {
        return this.getConfig().paddingRight;
    }

    public get paddingBottom(): number {
        return this.getConfig().paddingBottom;
    }
}
