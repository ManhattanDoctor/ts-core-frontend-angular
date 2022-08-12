import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import { LanguageService } from '@ts-core/frontend';
import { takeUntil } from 'rxjs';
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

    private lastKey: string;
    private lastParams: any;

    private lastValue: string;

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private detection: ChangeDetectorRef, private language: LanguageService) {
        super();
        language.completed.pipe(takeUntil(this.destroyed)).subscribe(this.lastValueUpdate);
    }

    // --------------------------------------------------------------------------
    //
    //	Private Methods
    //
    // --------------------------------------------------------------------------

    private lastValueUpdate = (): void => {
        this.lastValue = this.language.translate(this.lastKey, this.lastParams);
        this.detection.markForCheck();
    };

    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform(key: string, params?: any): string {
        if (key === this.lastKey) {
            if (params === this.lastParams || (_.isNil(params) && _.isNil(this.lastParams))) {
                return this.lastValue;
            }
        }

        this.lastKey = key;
        this.lastParams = params;
        this.lastValueUpdate();

        return this.lastValue;
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.language = null;
        this.detection = null;

        this.lastKey = null;
        this.lastParams = null;

        this.lastValue = null;
    }
}
