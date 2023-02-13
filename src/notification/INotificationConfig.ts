import { IWindowConfig } from '../window/IWindowConfig';

export interface INotificationConfig<T = any> extends IWindowConfig<T> {
    icon: string;
    sound: string;
    iconId: string;
    picture: string;

    closeDuration: number;
    isRemoveAfterClose: boolean;
}
