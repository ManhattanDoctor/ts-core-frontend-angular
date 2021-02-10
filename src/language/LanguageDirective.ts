import { Directive, ElementRef, Input } from '@angular/core';
import { Destroyable } from '@ts-core/common';
import { LanguageService } from '@ts-core/frontend/language';
import * as _ from 'lodash';
import { ViewUtil } from '../util/ViewUtil';

@Directive({
    selector: '[vi-translate]'
})
export class LanguageDirective extends Destroyable {
    // --------------------------------------------------------------------------
    //
    //	Properties
    //
    // --------------------------------------------------------------------------

    @Input()
    public isNeedTitle: boolean;

    protected _key: string;
    protected _params: any;

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(protected element: ElementRef, protected language: LanguageService) {
        super();
    }

    // --------------------------------------------------------------------------
    //
    //	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected translate(): void {
        if (_.isNil(this.key)) {
            return;
        }

        let value = this.language.translate(this.key, this.params);
        ViewUtil.setProperty(this.element, 'innerHTML', value);
        if (this.isNeedTitle) {
            ViewUtil.setProperty(this.element, 'title', value);
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
        this._params = null;
    }

    // --------------------------------------------------------------------------
    //
    //	Public Properties
    //
    // --------------------------------------------------------------------------

    @Input('vi-translate')
    public set key(value: string) {
        if (value === this._key) {
            return;
        }
        this._key = value;
        if (!_.isNil(value)) {
            this.translate();
        }
    }
    public get key(): string {
        return this._key;
    }

    @Input()
    public set params(value: any) {
        if (value === this._params) {
            return;
        }
        this._params = value;
        this.translate();
    }
    public get params(): any {
        return this._params;
    }
}
