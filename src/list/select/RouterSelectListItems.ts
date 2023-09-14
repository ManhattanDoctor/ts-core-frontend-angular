import { LanguageService } from '@ts-core/frontend';
import { SelectListItems } from './SelectListItems';
import { ISelectListItem } from './ISelectListItem';
import { RouterBaseService } from '../../service/RouterBaseService';
import { takeUntil } from 'rxjs';
import * as _ from 'lodash';

export class RouterSelectListItems<U = string> extends SelectListItems<ISelectListItem<U>, U> {
    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(protected router: RouterBaseService, language: LanguageService) {
        super(language, true);
        this.changed.pipe(takeUntil(this.destroyed)).subscribe(this.setFragment);
        this.router.completed.pipe(takeUntil(this.destroyed)).subscribe(this.setData);
    }

    //--------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    //--------------------------------------------------------------------------

    protected setData = (): void => {
        this.selectedData = this.getRouterSelectedData();
    };

    protected setFragment = (item: ISelectListItem<U>): void => {
        this.router.setFragment(item.data.toString());
    };

    protected getRouterSelectedData(): U {
        let item = _.find(this.collection, { data: this.router.getFragment() }) as ISelectListItem<U>;
        return !_.isNil(item) ? item.data : null;
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public complete(): void {
        let item = this.getRouterSelectedData();
        super.complete(_.isNil(item) ? 0 : item);
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.router = null;
    }
}
