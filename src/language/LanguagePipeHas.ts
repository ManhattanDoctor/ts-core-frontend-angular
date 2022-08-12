import { Pipe, PipeTransform } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { LanguageService } from '@ts-core/frontend';
import { takeUntil } from 'rxjs';
import * as _ from 'lodash';

@Pipe({
    name: 'viTranslateHas',
    pure: false
})
export class LanguagePipeHas extends DestroyableContainer implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Properties
    //
    // --------------------------------------------------------------------------

    private key: string;
    private _value: boolean;

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private language: LanguageService) {
        super();
        language.completed.pipe(takeUntil(this.destroyed)).subscribe(this.valueUpdate);
    }

    // --------------------------------------------------------------------------
    //
    //	Private Methods
    //
    // --------------------------------------------------------------------------

    private valueUpdate = (): void => {
        this._value = this.language.isHasTranslation(this.key);
    };

    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform(key: string): boolean {
        this.key = key;
        if (_.isNil(this._value)) {
            this.valueUpdate();
        }
        return this._value;
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.language = null;

        this.key = null;
    }
}
