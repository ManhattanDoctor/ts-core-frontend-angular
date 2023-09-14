import { ValueStorage } from './ValueStorage';
import * as _ from 'lodash';

export class BooleanValueStorage extends ValueStorage<boolean> {
    //--------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    //--------------------------------------------------------------------------

    protected serialize(value: string): boolean {
        return value === 'true';
    }

    protected deserialize(value: boolean): string {
        return value ? 'true' : 'false';
    }
}
