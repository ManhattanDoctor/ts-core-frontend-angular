import { LanguageService } from '@ts-core/frontend';
import { SelectListItems } from './SelectListItems';
import { ISelectListItem } from './ISelectListItem';
import { RouterBaseService } from '../../service/RouterBaseService';
import { filter, takeUntil } from 'rxjs';
import * as _ from 'lodash';

export class RouterSelectListItems<U = string> extends SelectListItems<ISelectListItem<U>, U> {
    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public isDisabled: boolean;

    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(protected router: RouterBaseService, language: LanguageService) {
        super(language, true);
        this.changed
            .pipe(
                filter(() => !this.isDisabled),
                takeUntil(this.destroyed)
            )
            .subscribe(item => this.setFragment(item));
        this.router.completed
            .pipe(
                filter(() => !this.isDisabled),
                takeUntil(this.destroyed)
            )
            .subscribe(() => this.setData());
    }

    //--------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    //--------------------------------------------------------------------------

    protected setData(): void {
        let item = this.getRouterSelectedItem();
        this.selectedItem = !_.isNil(item) ? item : _.first(this.collection);
    }

    protected setFragment(item: ISelectListItem<U>): void {
        let index = _.indexOf(this.collection, item);
        this.router.setFragment(index > 0 ? item.data.toString() : null);
    }

    protected getRouterSelectedItem(): ISelectListItem<U> {
        return _.find(this.collection, { data: this.router.getFragment() }) as ISelectListItem<U>;
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public complete(): void {
        let item = this.getRouterSelectedItem();
        super.complete(!_.isNil(item) ? item.data : 0);
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.router = null;
    }
}
