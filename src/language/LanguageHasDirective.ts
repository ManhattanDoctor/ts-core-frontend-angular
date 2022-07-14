import { Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Destroyable } from '@ts-core/common';
import { LanguageService } from '@ts-core/frontend/language';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';

@Directive({
    selector: '[viTranslateHas]'
})
export class LanguageHasDirective extends Destroyable {
    // --------------------------------------------------------------------------
    //
    //	Properties
    //
    // --------------------------------------------------------------------------

    protected _viTranslateHas: string;
    protected _isOnlyIfNotEmpty: boolean = true;

    protected view: any;
    protected index: EmbeddedViewRef<any>;

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private template: TemplateRef<any>, private container: ViewContainerRef, protected language: LanguageService) {
        super();
        language.completed.pipe(takeUntil(this.destroyed)).subscribe(() => this.check());
    }

    // --------------------------------------------------------------------------
    //
    //	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected check(): void {
        let isNeedAdd = false;
        let isNeedRemove = false;
        let isHasTranslation = !_.isNil(this.viTranslateHas) && this.language.isHasTranslation(this.viTranslateHas, this.viTranslateHasIsOnlyIfNotEmpty);

        if (isHasTranslation) {
            if (_.isNil(this.view)) {
                isNeedAdd = true;
            }
        } else {
            if (!_.isNil(this.view)) {
                isNeedRemove = true;
            }
        }

        if (isNeedAdd) {
            this.view = this.container.createEmbeddedView(this.template);
        } else if (isNeedRemove) {
            let index = this.container.indexOf(this.view);
            if (index >= 0) {
                this.container.remove(index);
                this.view = null;
            }
        }
    }

    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }

        super.destroy();
        this.view = null;
        this.language = null;
        this._viTranslateHas = null;
    }

    // --------------------------------------------------------------------------
    //
    //	Public Properties
    //
    // --------------------------------------------------------------------------

    @Input('viTranslateHas')
    public set viTranslateHas(value: string) {
        if (value === this._viTranslateHas) {
            return;
        }
        this._viTranslateHas = value;
        this.check();
    }
    public get viTranslateHas(): string {
        return this._viTranslateHas;
    }

    @Input('viTranslateHasIsOnlyIfNotEmpty')
    public set viTranslateHasIsOnlyIfNotEmpty(value: boolean) {
        if (value === this._isOnlyIfNotEmpty) {
            return;
        }
        this._isOnlyIfNotEmpty = value;
        this.check();
    }
    public get viTranslateHasIsOnlyIfNotEmpty(): boolean {
        return this._isOnlyIfNotEmpty;
    }
}
