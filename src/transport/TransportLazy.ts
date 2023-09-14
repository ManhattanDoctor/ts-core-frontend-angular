import { ITransportCommand, ITransportCommandOptions, ITransportEvent, ITransportSettings } from '@ts-core/common';
import { TransportLocal } from '@ts-core/common';
import * as _ from 'lodash';
import { LazyModuleLoader } from '../module/LazyModuleLoader';
import { ILogger } from '@ts-core/common';
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
        this.logEventFilters.push(item => item.name !== TransportLazyModuleLoadedEvent.NAME);
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

    protected async commandResponseRequestDispatch<U>(command: ITransportCommand<U>, options: ITransportCommandOptions, isNeedReply: boolean): Promise<void> {
        let item = this.getModuleByCommand(command.name);
        if (!_.isNil(item)) {
            await this.loader.loadIfNeed(item.id);
        }
        return super.commandResponseRequestDispatch(command, options, isNeedReply);
    }

    protected async eventRequestExecute<U>(event: ITransportEvent<U>): Promise<void> {
        let item = this.getModuleByEvent(event.name);
        if (!_.isNil(this.loader) && !_.isNil(item)) {
            this.loader.loadIfNeed(item.id).then(() => super.eventRequestExecute(event));
        } else {
            super.eventRequestExecute(event);
        }
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

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.loader = null;
    }
}
