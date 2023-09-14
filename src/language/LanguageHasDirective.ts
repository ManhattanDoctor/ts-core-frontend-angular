import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { LanguageService } from '@ts-core/frontend';
import { takeUntil } from 'rxjs';
import { StructureDirective } from '../directive/StructureDirective';
import * as _ from 'lodash';

@Directive({
    selector: '[viTranslateHas]'
})
export class LanguageHasDirective<T = any> extends StructureDirective<T> {
    // --------------------------------------------------------------------------
    //
    //	Properties
    //
    // --------------------------------------------------------------------------

    protected _viTranslateHas: string;
    protected _isOnlyIfNotEmpty: boolean = true;

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(template: TemplateRef<T>, container: ViewContainerRef, protected language: LanguageService) {
        super(template, container);
        language.completed.pipe(takeUntil(this.destroyed)).subscribe(() => this.check());
    }

    // --------------------------------------------------------------------------
    //
    //	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected check(): void {
        this.isNeedAdd = !_.isNil(this.viTranslateHas) && this.language.isHasTranslation(this.viTranslateHas, this.viTranslateHasIsOnlyIfNotEmpty);
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
