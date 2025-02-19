import { ValueStorage } from './ValueStorage';
import * as _ from 'lodash';

export class JSONValueStorage<T = any> extends ValueStorage<T> {
    //--------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    //--------------------------------------------------------------------------

    protected serialize(value: string): T {
        return JSON.parse(value);
    }

    protected deserialize(value: T): string {
        return JSON.stringify(value);
    }
}
