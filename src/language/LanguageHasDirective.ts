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

    protected _key: string;

    protected view: any;
    protected index: EmbeddedViewRef<any>;

    @Input('is-only-if-not-empty')
    public isOnlyIfNotEmpty: boolean = false;

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
        let isHasTranslation = !_.isNil(this.key) && this.language.isHasTranslation(this.key, this.isOnlyIfNotEmpty);

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
        this.language = null;

        this._key = null;
    }

    // --------------------------------------------------------------------------
    //
    //	Public Properties
    //
    // --------------------------------------------------------------------------

    @Input('viTranslateHas')
    public set key(value: string) {
        if (value === this._key) {
            return;
        }
        this._key = value;
        this.check();
    }
    public get key(): string {
        return this._key;
    }
}
