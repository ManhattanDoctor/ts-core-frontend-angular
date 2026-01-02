import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';

export interface IRouterDeactivatable {
    isForceDeactivate: boolean;

    isCanDeactivate(currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): MaybeAsync<GuardResult>;
}
