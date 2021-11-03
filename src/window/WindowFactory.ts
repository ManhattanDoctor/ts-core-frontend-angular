import { IWindow } from './IWindow';
import { WindowProperties } from './WindowProperties';

export class WindowFactory<U extends IWindow> {
    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(protected classType: WindowType<U>) {}

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public create(properties: WindowProperties): U {
        return new this.classType(properties);
    }
}

export interface WindowType<T> {
    new (properties: WindowProperties): T;
}
