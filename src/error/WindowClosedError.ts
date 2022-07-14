import { ExtendedError } from '@ts-core/common/error';
import * as _ from 'lodash';

export class WindowClosedError extends ExtendedError<void, number> {
    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static CODE = ExtendedError.DEFAULT_ERROR_CODE;
    public static MESSAGE = 'Window was closed';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(message: string = WindowClosedError.MESSAGE, code: number = WindowClosedError.CODE) {
        super(message, code);
    }
}
