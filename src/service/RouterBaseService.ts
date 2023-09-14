import {
    ActivatedRoute,
    ActivatedRouteSnapshot,
    NavigationCancel,
    NavigationEnd,
    NavigationError,
    NavigationExtras,
    NavigationStart,
    Router,
    UrlTree
} from '@angular/router';
import { Loadable, LoadableEvent, LoadableStatus } from '@ts-core/common';
import { ObservableData } from '@ts-core/common';
import { NativeWindowService } from '@ts-core/frontend';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs';

export class RouterBaseService extends Loadable<void, RouterBaseServiceEventData> {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    protected params: Map<string, string>;

    protected extrasToApply: NavigationExtras;
    protected isNeedUpdateExtras: boolean = false;

    protected _lastUrl: string;
    protected _previousUrl: string;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(protected _router: Router, protected _route: ActivatedRoute, protected window: NativeWindowService) {
        super();
        this.params = new Map();
        this.observer = new Subject();

        this._lastUrl = this.url;
        this.window.getParams().forEach((value, key) => this.params.set(key, value));
        this.initializeObservers();
    }

    // --------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    // --------------------------------------------------------------------------

    protected initializeObservers(): void {
        this.router.events.pipe(takeUntil(this.destroyed)).subscribe(event => {
            if (event instanceof NavigationStart) {
                this._previousUrl = this.url;
                this.status = LoadableStatus.LOADING;
            } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
                if (event instanceof NavigationEnd) {
                    this._lastUrl = event.url;
                }
                this.status = LoadableStatus.LOADED;
            }
        });
    }

    protected async applyExtras(extras?: NavigationExtras): Promise<boolean> {
        let params = {} as NavigationExtras;
        params.queryParams = this.getQueryParams();

        if (!_.isNil(extras)) {
            Object.assign(params, extras);
        }

        if (!this.isLoading) {
            return this.router.navigate([], params);
        }
        this.extrasToApply = extras;
        this.isNeedUpdateExtras = true;
        return false;
    }

    protected getQueryParams(): any {
        let params = {} as any;
        this.params.forEach((value, key) => (params[key] = value));
        return params;
    }

    protected commitStatusChangedProperties(oldStatus: LoadableStatus, newStatus: LoadableStatus): void {
        super.commitStatusChangedProperties(oldStatus, newStatus);

        switch (newStatus) {
            case LoadableStatus.LOADING:
                this.observer.next(new ObservableData(LoadableEvent.STARTED));
                break;
            case LoadableStatus.LOADED:
                if (this.isNeedUpdateExtras) {
                    this.isNeedUpdateExtras = false;
                    this.applyExtras(this.extrasToApply);
                }
                this.observer.next(new ObservableData(LoadableEvent.COMPLETE, { url: this.url, previousUrl: this.previousUrl }));
                break;
        }

        if (newStatus === LoadableStatus.LOADED || newStatus === LoadableStatus.ERROR) {
            this.observer.next(new ObservableData(LoadableEvent.FINISHED));
        }
    }

    // --------------------------------------------------------------------------
    //
    // 	Navigate Methods
    //
    // --------------------------------------------------------------------------

    public async navigate(url: string, extras?: NavigationExtras, isClearParams?: boolean): Promise<boolean> {
        if (isClearParams) {
            this.params.clear();
        }

        let params = {} as NavigationExtras;
        params.queryParams = this.getQueryParams();
        if (!_.isNil(extras)) {
            Object.assign(params, extras);
        }
        return this.router.navigateByUrl(url, params);
    }

    public navigateToExternalUrl(url: string, target: string = '_blank'): void {
        this.window.open(url, target);
    }

    public navigateToLast(extras?: NavigationExtras): Promise<boolean> {
        return this.navigate(this.lastUrl, extras);
    }

    public async navigateIfNotLoading(url: string, extras?: NavigationExtras): Promise<boolean> {
        return !this.isLoading ? this.navigate(url, extras) : false;
    }

    public reload(): void {
        location.reload();
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public isUrlActive(item: string | UrlTree, isExact: boolean = false): boolean {
        if (isExact) {
            return this.router.isActive(item, isExact);
        }
        if (_.isString(item)) {
            item = this.router.parseUrl(item);
        }

        let current = this.router.parseUrl(this.urlTree.toString());
        item.fragment = current.fragment = null;
        item.queryParams = current.queryParams = {};
        return item.toString() === current.toString();
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Param Methods
    //
    // --------------------------------------------------------------------------

    public getParams<T = any>(): T {
        let params = {} as any;
        this.params.forEach((value, key) => (params[key] = value));
        return params;
    }

    public hasParam(name: string): boolean {
        return this.params.has(name);
    }

    public getParam<T = string>(name: string, defaultValue?: T): T {
        return this.hasParam(name) ? (this.params.get(name) as any) : defaultValue;
    }

    public setParam(name: string, value: any, extras?: NavigationExtras): void {
        if (!_.isNil(value)) {
            value = value.toString().trim();
            if (_.isEmpty(value)) {
                value = null;
            }
        }
        if (!_.isNil(value)) {
            this.params.set(name, value);
        } else {
            this.params.delete(name);
        }
        if (!_.isNil(extras)) {
            extras = { replaceUrl: true };
        }
        this.applyExtras(extras);
    }

    public removeParam(name: string, extras?: NavigationExtras): void {
        if (this.hasParam(name)) {
            this.setParam(name, null, extras);
        }
    }

    public clearParams(extras?: NavigationExtras): void {
        this.params.clear();
        if (!_.isNil(extras)) {
            extras = { replaceUrl: true };
        }
        this.applyExtras(extras);
    }

    public get hasParams(): boolean {
        return this.params.size > 0;
    }

    // --------------------------------------------------------------------------
    //
    // 	Fragment Methods
    //
    // --------------------------------------------------------------------------

    public getFragment(snapshot?: ActivatedRouteSnapshot, defaultValue?: string): string {
        if (_.isNil(snapshot)) {
            snapshot = this.route.snapshot;
        }
        return !_.isNil(snapshot.fragment) ? snapshot.fragment : defaultValue;
    }

    public async setFragment(value: string): Promise<boolean> {
        return this.applyExtras({ fragment: value });
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Url Methods
    //
    // --------------------------------------------------------------------------

    public get url(): string {
        return this.router.url;
    }
    public get urlTree(): UrlTree {
        return this.router.parseUrl(this.url);
    }

    public get lastUrl(): string {
        return this._lastUrl;
    }
    public get lastUrlTree(): UrlTree {
        return this.router.parseUrl(this.lastUrl);
    }

    public get previousUrl(): string {
        return this._previousUrl;
    }
    public get previousUrlTree(): UrlTree {
        return this.router.parseUrl(this.previousUrl);
    }

    public get route(): ActivatedRoute {
        return this._route;
    }

    public get router(): Router {
        return this._router;
    }
}

export interface RouterBaseServiceEventData {
    url: string;
    previousUrl: string;
}
