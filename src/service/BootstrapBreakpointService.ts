import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { ObservableData } from '@ts-core/common';

import * as _ from 'lodash';
import { merge, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BootstrapBreakpointService extends DestroyableContainer {
    // --------------------------------------------------------------------------
    //
    // 	Constants
    //
    // --------------------------------------------------------------------------

    public static DEFAULT_SM = 576;
    public static DEFAULT_MD = 768;
    public static DEFAULT_LG = 992;
    public static DEFAULT_XL = 1200;
    public static DEFAULT_XXL = 1400;

    protected _breakpoint: BootstrapBreakpoint;
    protected items: Array<IBreakpointItem>;

    protected observer: Subject<ObservableData<BootstrapBreakpointServiceEvent, BootstrapBreakpoint>>;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(protected service: BreakpointObserver) {
        super();
        this.observer = new Subject();
        this.initialize();
    }

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected initialize(
        sm: number = BootstrapBreakpointService.DEFAULT_SM,
        md: number = BootstrapBreakpointService.DEFAULT_MD,
        lg: number = BootstrapBreakpointService.DEFAULT_LG,
        xl: number = BootstrapBreakpointService.DEFAULT_XL,
        xxl: number = BootstrapBreakpointService.DEFAULT_XXL
    ): void {
        this.items = [
            { name: BootstrapBreakpoint.XXL, value: `(min-width: ${xxl}px)` },
            { name: BootstrapBreakpoint.XL, value: `(min-width: ${xl}px)` },
            { name: BootstrapBreakpoint.LG, value: `(min-width: ${lg}px)` },
            { name: BootstrapBreakpoint.MD, value: `(min-width: ${md}px)` },
            { name: BootstrapBreakpoint.SM, value: `(min-width: 0px)` }
        ];

        merge(...this.items.map(item => this.service.observe(item.value)))
            .pipe(takeUntil(this.destroyed))
            .subscribe(() => this.setBreakpoint(this.getBreakpoint()));
    }

    protected getBreakpoint(): BootstrapBreakpoint {
        for (let item of this.items) {
            if (this.service.isMatched(item.value)) {
                return item.name;
            }
        }
        return null;
    }

    protected setBreakpoint(value: BootstrapBreakpoint): void {
        if (value === this._breakpoint) {
            return;
        }
        this._breakpoint = value;
        this.observer.next(new ObservableData(BootstrapBreakpointServiceEvent.CHANGED, this.breakpoint));
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public isEqual(item: BootstrapBreakpoint): boolean {
        return item === this.breakpoint;
    }

    public isUp(item: BootstrapBreakpoint): boolean {
        return _.findIndex(this.items, { name: this.breakpoint }) < _.findIndex(this.items, { name: item });
    }

    public isUpOrEqual(item: BootstrapBreakpoint): boolean {
        return this.isEqual(item) || this.isUp(item);
    }

    public isDown(item: BootstrapBreakpoint): boolean {
        return _.findIndex(this.items, { name: this.breakpoint }) > _.findIndex(this.items, { name: item });
    }

    public isDownOrEqual(item: BootstrapBreakpoint): boolean {
        return this.isEqual(item) || this.isDown(item);
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get breakpoint(): BootstrapBreakpoint {
        return this._breakpoint;
    }

    public get events(): Observable<ObservableData<BootstrapBreakpointServiceEvent, BootstrapBreakpoint>> {
        return this.observer.asObservable();
    }

    public get changed(): Observable<BootstrapBreakpoint> {
        return this.events.pipe(
            filter(item => item.type === BootstrapBreakpointServiceEvent.CHANGED),
            map(item => item.data)
        );
    }
}

interface IBreakpointItem {
    name: BootstrapBreakpoint;
    value: string;
}

export enum BootstrapBreakpointServiceEvent {
    CHANGED = 'CHANGED'
}

export enum BootstrapBreakpoint {
    SM = 'sm',
    MD = 'md',
    LG = 'lg',
    XL = 'xl',
    XXL = 'xxl'
}
