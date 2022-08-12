import { TransportEvent } from '@ts-core/common';
import { ITransportLazyModuleData } from './TransportLazyModule';

export class TransportLazyModuleLoadedEvent<T extends ITransportLazyModuleData = ITransportLazyModuleData> extends TransportEvent<T> {
    // --------------------------------------------------------------------------
    //
    //  Public Static Properties
    //
    // --------------------------------------------------------------------------

    public static readonly NAME = 'TransportLazyModuleLoadedEvent';

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(request: T) {
        super(TransportLazyModuleLoadedEvent.NAME, request);
    }
}
