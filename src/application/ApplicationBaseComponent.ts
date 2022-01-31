import { AfterViewInit, Component, Inject, Injectable, Optional } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { PromiseHandler } from '@ts-core/common/promise';
import * as _ from 'lodash';

@Component({ template: '' })
export abstract class ApplicationBaseComponent extends DestroyableContainer implements AfterViewInit {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    protected timeout: any;
    protected isReadyAlreadyCalled: boolean;

    protected viewReadyDelay: number = NaN;
    protected viewReadyPromise: PromiseHandler<void, void>;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor() {
        super();
        this.viewReadyPromise = PromiseHandler.create();
    }

    // --------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    // --------------------------------------------------------------------------

    private makeViewReady = (): void => {
        this.viewReadyPromise.resolve();
        this.viewReadyHandler();
        this.checkReady();
    };

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected checkReady(): void {
        if (this.isReadyAlreadyCalled || !this.isReady()) {
            return;
        }
        this.isReadyAlreadyCalled = true;
        this.readyHandler();
    }

    protected isReady(): boolean {
        return this.isViewReady;
    }

    protected viewReadyHandler(): void {}

    protected abstract readyHandler(): void;

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public ngAfterViewInit(): void {
        if (this.viewReadyDelay > 0) {
            PromiseHandler.delay(this.viewReadyDelay).then(this.makeViewReady);
        } else {
            this.makeViewReady();
        }
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();

        if (!_.isNil(this.viewReadyPromise)) {
            this.viewReadyPromise.reject();
            this.viewReadyPromise = null;
        }

        if (!_.isNil(this.timeout)) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get isViewReady(): boolean {
        return !_.isNil(this.viewReadyPromise) ? this.viewReadyPromise.isResolved : false;
    }
    public get viewReady(): Promise<void> {
        return !_.isNil(this.viewReadyPromise) ? this.viewReadyPromise.promise : null;
    }
}
