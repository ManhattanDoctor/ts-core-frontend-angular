import { Compiler, Injectable, Injector, NgModuleFactory, NgModuleRef, Type } from '@angular/core';
import { Loadable, LoadableEvent } from '@ts-core/common';
import { ExtendedError } from '@ts-core/common/error';
import { MapCollection } from '@ts-core/common/map';
import { ObservableData } from '@ts-core/common/observer';
import * as _ from 'lodash';

@Injectable({ providedIn: 'root' })
export class LazyModuleLoader<T extends ILazyModuleData = ILazyModuleData> extends Loadable {
    //--------------------------------------------------------------------------
    //
    //  Properties
    //
    //--------------------------------------------------------------------------

    protected _modules: MapCollection<T>;

    //--------------------------------------------------------------------------
    //
    //  Constructor
    //
    //--------------------------------------------------------------------------

    constructor(protected compiler: Compiler, protected injector: Injector) {
        super();
        this._modules = new MapCollection('id');
    }

    //--------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    //--------------------------------------------------------------------------

    protected async load(item: T): Promise<void> {
        item.reference = await this.loadReference(item.path);
    }

    protected async loadReference<T>(path: LazyModulePath<T>): Promise<NgModuleRef<T>> {
        let moduleFactory: NgModuleFactory<T> = null;
        let elementModuleOrFactory: NgModuleFactory<T> | Type<T> = await path();
        if (elementModuleOrFactory instanceof NgModuleFactory) {
            moduleFactory = elementModuleOrFactory;
        } else {
            moduleFactory = await this.compiler.compileModuleAsync(elementModuleOrFactory);
        }
        return moduleFactory.create(this.injector);
    }

    protected isNeedLoad(item: T): boolean {
        return _.isNil(item.reference);
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public async loadIfNeed(id: string): Promise<T> {
        let item = this.modules.get(id);
        if (_.isNil(item)) {
            throw new ExtendedError(`Unable to find "${id}" module: it must be registered first`);
        }
        if (!this.isNeedLoad(item)) {
            return item;
        }
        try {
            this.observer.next(new ObservableData(LoadableEvent.STARTED));
            await this.load(item);
        } finally {
            this.observer.next(new ObservableData(LoadableEvent.FINISHED));
        }
        return item;
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();

        if (!_.isNil(this._modules)) {
            this._modules.destroy();
            this._modules = null;
        }
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get modules(): MapCollection<T> {
        return this._modules;
    }
}

export interface ILazyModuleData<T = any> {
    id: string;
    path?: LazyModulePath<T>;
    reference?: NgModuleRef<T>;
}

export type LazyModulePath<T> = () => Promise<NgModuleFactory<T> | Type<T>>;
