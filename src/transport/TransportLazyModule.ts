import { NgModuleRef } from '@angular/core';
import { Transport } from '@ts-core/common';
import { ILazyModuleData } from '../module/LazyModuleLoader';
import { TransportLazyModuleLoadedEvent } from './TransportLazyModuleLoadedEvent';

export abstract class TransportLazyModule<T> implements ITransportLazyModuleData<T> {
    //--------------------------------------------------------------------------
    //
    //  Constructor
    //
    //--------------------------------------------------------------------------

    constructor(public reference: NgModuleRef<T>, protected transport: Transport) {
        this.moduleLoadedDispatch();
    }

    //--------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    //--------------------------------------------------------------------------

    protected moduleLoadedDispatch(): void {
        this.transport.dispatch(new TransportLazyModuleLoadedEvent(this));
    }

    //--------------------------------------------------------------------------
    //
    //  Public Properties
    //
    //--------------------------------------------------------------------------

    public abstract get id(): string;

    public get events(): Array<string> {
        return new Array();
    }

    public get commands(): Array<string> {
        return new Array();
    }
}

export interface ITransportLazyModuleData<T = any> extends ILazyModuleData<T> {
    events?: Array<string>;
    commands?: Array<string>;
}
