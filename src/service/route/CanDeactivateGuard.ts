import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, GuardResult, MaybeAsync, CanDeactivateFn } from '@angular/router';
import { IRouterDeactivatable } from './IRouterDeactivatable';
import * as _ from 'lodash';

export class CanDeactivateGuard<T extends IRouterDeactivatable = IRouterDeactivatable> implements CanDeactivate<T> {
    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public canDeactivate(
        component: T,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot
    ): MaybeAsync<GuardResult> {
        return CanDeactivateFunction(component, currentRoute, currentState, nextState);
    }
}

export const CanDeactivateFunction: CanDeactivateFn<IRouterDeactivatable> = (
    component: IRouterDeactivatable,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
): MaybeAsync<GuardResult> => (!component.isForceDeactivate ? component.isCanDeactivate(currentRoute, currentState, nextState) : true);
