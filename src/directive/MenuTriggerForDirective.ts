import { MatMenuPanel, MatMenuTrigger } from '@angular/material/menu';
import { FlexibleConnectedPositionStrategy, PositionStrategy } from '@angular/cdk/overlay';
import * as _ from 'lodash';
import { Directive, Input } from '@angular/core';

@Directive({
    selector: '[vi-menu-trigger-for]'
})
export class MenuTriggerForDirective extends MatMenuTrigger {
    //--------------------------------------------------------------------------
    //
    //	Public Methods
    //
    //--------------------------------------------------------------------------

    public openMenuOn(target: any): void {
        if (_.isNil(target)) return;

        this.openMenu();
        let strategy = this.getPositionStrategy();
        if (strategy instanceof FlexibleConnectedPositionStrategy) {
            strategy['_origin'] = target;
            strategy.apply();
        }
    }

    //--------------------------------------------------------------------------
    //
    //	Protected Methods
    //
    //--------------------------------------------------------------------------

    protected getPositionStrategy(): PositionStrategy {
        return !_.isNil(this['_overlayRef']) ? this['_overlayRef'].getConfig().positionStrategy : null;
    }

    //--------------------------------------------------------------------------
    //
    //	Public Properties
    //
    //--------------------------------------------------------------------------

    @Input('vi-menu-trigger-for')
    public set menu(value: MatMenuPanel) {
        super.menu = value;
    }
    public get menu(): MatMenuPanel {
        return super.menu;
    }
}
