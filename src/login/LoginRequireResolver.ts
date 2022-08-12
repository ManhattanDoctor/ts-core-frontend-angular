import { Resolve } from '@angular/router';
import { LoginBaseService, LoginBaseServiceEvent } from './LoginBaseService';
import { PromiseHandler } from '@ts-core/common';

export class LoginRequireResolver<T extends LoginBaseService = LoginBaseService> implements Resolve<void> {
    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(protected login: T) {}

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public resolve(): Promise<void> {
        if (this.isLoggedIn()) {
            return Promise.resolve();
        }

        let promise = PromiseHandler.create<void>();
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
