import { Pipe, PipeTransform } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { LanguageService } from '@ts-core/frontend/language';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';

@Pipe({
    name: 'viTranslate',
    pure: false
})
export class LanguagePipe extends DestroyableContainer implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Static Methods
    //
    // --------------------------------------------------------------------------

    public static removeTags(item: string): string {
        if (_.isEmpty(item)) {
            return item;
        }
        item = item.replace(/<br\s*[\/]?>/g, '\n');
        item = item.replace(/<[^>]*>/g, '');
        return item;
    }

    // --------------------------------------------------------------------------
    //
    //	Properties
    //
    // --------------------------------------------------------------------------

    private key: string;
    private params: string;
    private _value: string;

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
        this._value = this.language.translate(this.key, this.params);
    };

    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform(key: string, params?: any): string {
        this.key = key;
        this.params = params;
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
        this.params = null;
    }
}
