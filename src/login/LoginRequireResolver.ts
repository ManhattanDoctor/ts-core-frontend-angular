import { Resolve } from '@angular/router';
import { LoginBaseService, LoginBaseServiceEvent } from './LoginBaseService';
import { PromiseHandler } from '@ts-core/common';

export class LoginRequireResolver<U extends LoginBaseService = LoginBaseService, V = void> implements Resolve<V> {
    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(protected login: U) {}

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public resolve(...params): Promise<V> {
        if (this.isLoggedIn()) {
            return Promise.resolve(null);
        }

        let promise = PromiseHandler.create<null>();
        let subscription = this.login.events.subscribe(data => {
            if (data.type === LoginBaseServiceEvent.LOGIN_ERROR) {
                promise.reject(data.error.toString());
            } else if (data.type === LoginBaseServiceEvent.LOGIN_COMPLETE) {
                promise.resolve();
            } else if (data.type === LoginBaseServiceEvent.LOGIN_FINISHED) {
                subscription.unsubscribe();
            }
        });
        return promise.promise;
    }

    public isLoggedIn(): boolean {
        return this.login.isLoggedIn;
    }
}
