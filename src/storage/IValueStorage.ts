import { IDestroyable } from '@ts-core/common';
import * as _ from 'lodash';

export interface IValueStorage<T> extends IDestroyable {
    get(defaultValue?: T): T;
    set(value: T): T;
    has(): boolean;
    destroy(): void;

    get name(): string;
}
