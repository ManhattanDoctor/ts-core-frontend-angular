import { IWindow } from './IWindow';
import { WindowProperties } from './WindowProperties';
import * as _ from 'lodash';

export class WindowFactory<U extends IWindow> {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    public createFunction: CreateFunction;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(protected defaultType: WindowType<U>) {}

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public create(properties: WindowProperties): U {
        let item: U = null;
        if (!_.isNil(this.createFunction)) {
            item = this.createFunction(properties);
        }
        if (_.isNil(item)) {
            item = new this.defaultType(properties);
        }
        return item;
    }
}

export type CreateFunction = <U extends IWindow>(properties: WindowProperties) => U;

export interface WindowType<T> {
    new (properties: WindowProperties): T;
}
