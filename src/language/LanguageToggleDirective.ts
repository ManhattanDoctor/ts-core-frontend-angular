import { Directive, HostListener } from '@angular/core';
import { ArrayUtil, Destroyable } from '@ts-core/common';
import { LanguageService, SettingsServiceBase } from '@ts-core/frontend';
import * as _ from 'lodash';

@Directive({
    selector: '[vi-language-toggle]',
    standalone: false
})
export class LanguageToggleDirective extends Destroyable {
    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(
        private language: LanguageService,
        private settings: SettingsServiceBase
    ) {
        super();
    }

    // --------------------------------------------------------------------------
    //
    //	Event Handlers
    //
    // --------------------------------------------------------------------------

    @HostListener('click')
    protected clickHandler() {
        let items = this.settings.languages.collection;
        let item = ArrayUtil.nextItem(_.find(items, { locale: this.language.locale }), items, true);
        if (!_.isNil(item)) {
            this.language.locale = item.locale;
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
    }
}
