import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { PromiseHandler, LoadableEvent, Loadable } from '@ts-core/common';
import * as _ from 'lodash';

export abstract class LoadableResolver<T extends Loadable> implements Resolve<void> {
    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(protected service: T) {}

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected resolveHandler(): void {}

    protected rejectHandler(): void {}

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void> {
        if (this.service.isLoaded) {
            this.resolveHandler();
            return Promise.resolve();
        }

        let promise = PromiseHandler.create<void>();
        let subscription = this.service.events.subscribe(data => {
            if (data.type === LoadableEvent.COMPLETE) {
                this.resolveHandler();
                promise.resolve();
            } else if (data.type === LoadableEvent.ERROR) {
                this.rejectHandler();
                let error = data.error?.toString();
                promise.reject(error);
            } else if (data.type === LoadableEvent.FINISHED) {
                subscription.unsubscribe();
            }
        });
        return promise.promise;
    }
}
