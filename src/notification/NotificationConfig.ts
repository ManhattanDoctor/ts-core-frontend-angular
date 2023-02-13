import { WindowConfig } from '../window/WindowConfig';
import { INotificationConfig } from './INotificationConfig';

export class NotificationConfig<T = any> extends WindowConfig<T> implements INotificationConfig<T> {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    public icon: string;
    public sound: string;
    public iconId: string;
    public picture: string;

    public closeDuration: number;
    public isRemoveAfterClose: boolean;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(data?: T) {
        super();
        this.data = data;
        this.isModal = false;
        this.closeDuration = NaN;
        this.isRemoveAfterClose = false;
    }
}

export type NotificationConfigOptions<T = any> = { [P in keyof NotificationConfig<T>]?: any };
