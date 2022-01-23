import { ITransportCommand, ITransportCommandOptions, ITransportEvent, ITransportSettings } from '@ts-core/common/transport';
import { TransportLocal } from '@ts-core/common/transport/local';
import * as _ from 'lodash';
import { LazyModuleLoader } from '../module/LazyModuleLoader';
import { ILogger } from '@ts-core/common/logger';
import { ITransportLazyModuleData } from './TransportLazyModule';
import { TransportLazyModuleLoadedEvent } from './TransportLazyModuleLoadedEvent';

export class TransportLazy extends TransportLocal {
    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------
    constructor(logger: ILogger, protected loader: LazyModuleLoader<ITransportLazyModuleData>, settings?: ITransportSettings) {
        super(logger, settings, null);

        this.getDispatcher<TransportLazyModuleLoadedEvent<ITransportLazyModuleData>>(TransportLazyModuleLoadedEvent.NAME).subscribe(event =>
            this.moduleLoadedHandler(event.data)
        );
    }

    // --------------------------------------------------------------------------
    //
    //  Event Handlers
    //
    // --------------------------------------------------------------------------

    protected moduleLoadedHandler(module: ITransportLazyModuleData): void {
        let item = this.loader.modules.get(module.id);
        if (_.isNil(item)) {
            item = this.loader.modules.add(module);
        }
        if (_.isNil(item.reference)) {
            item.reference = module.reference;
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected async dispatchCommand<U>(command: ITransportCommand<U>, options: ITransportCommandOptions, isNeedReply: boolean): Promise<void> {
        let item = this.getModuleByCommand(command.name);
        if (!_.isNil(item)) {
            await this.loader.loadIfNeed(item.id);
        }
        super.dispatchCommand(command, options, isNeedReply);
    }

    protected getModuleByCommand(name: string): ITransportLazyModuleData {
        if (this.loader.modules.length === 0) {
            return null;
        }
        for (let item of this.loader.modules.collection) {
            if (_.isEmpty(item.commands)) {
                continue;
            }
            if (_.includes(item.commands, name)) {
                return item;
            }
        }
        return null;
    }

    protected getModuleByEvent(name: string): ITransportLazyModuleData {
        if (_.isNil(this.loader) || this.loader.modules.length === 0) {
            return null;
        }
        for (let item of this.loader.modules.collection) {
            if (_.isEmpty(item.events)) {
                continue;
            }
            if (_.includes(item.events, name)) {
                return item;
            }
        }
        return null;
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public dispatch<T>(event: ITransportEvent<T>): void {
        let item = this.getModuleByEvent(event.name);
        if (!_.isNil(this.loader) && !_.isNil(item)) {
            this.loader.loadIfNeed(item.id).then(() => super.dispatch(event));
        } else {
            super.dispatch(event);
        }
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.loader = null;
    }
}
