import { Renderer2 } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { LoadableEvent } from '@ts-core/common';
import { Assets } from '@ts-core/frontend/asset';
import { Language } from '@ts-core/language';
import { LanguageService } from '@ts-core/frontend/language';
import { SettingsBaseService } from '@ts-core/frontend/service';
import { ThemeService } from '@ts-core/frontend/theme';
import { takeUntil } from 'rxjs/operators';
import { ViewUtil } from '../util/ViewUtil';
import { ApplicationBaseComponent } from './ApplicationBaseComponent';
import * as _ from 'lodash';
import moment from 'moment';
import numeral from 'numeral';

export abstract class ApplicationComponent<T extends SettingsBaseService> extends ApplicationBaseComponent {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    private isLanguageLoaded: boolean;

    // --------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    // --------------------------------------------------------------------------

    protected initialize(): void {
        ViewUtil.initialize(this.renderer);
        this.settings.initialize(this.config, this.routerParams);
        Assets.initialize(this.settings.assetsUrl);
        this.theme.initialize(this.settings.themes);

        // Language
        this.language.initialize(Assets.languagesUrl, this.settings.languages);
        this.language.events.pipe(takeUntil(this.destroyed)).subscribe(data => {
            switch (data.type) {
                case LoadableEvent.COMPLETE:
                    this.languageLoadingComplete(data.data as Language);
                    break;
                case LoadableEvent.ERROR:
                    this.languageLoadingError(data.data as Language, data.error);
                    break;
            }
        });
    }

    protected isReady(): boolean {
        return super.isReady() && this.isLanguageLoaded;
    }

    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    protected languageLoadingComplete(item: Language): void {
        this.isLanguageLoaded = true;
        this.setLocale(item);
        this.checkReady();
    }

    protected viewReadyHandler(): void {
        this.initialize();
    }

    protected setLocale(item: Language): void {
        moment.locale(item.locale);
        numeral.locale(item.locale);
        if (!_.isNil(this.dateAdapter)) {
            this.dateAdapter.setLocale(item.locale);
        }
    }

    protected abstract languageLoadingError(item: Language, error: Error): void;

    // --------------------------------------------------------------------------
    //
    // 	Protected Properties
    //
    // --------------------------------------------------------------------------

    protected abstract get config(): any;
    protected abstract get routerParams(): any;

    // --------------------------------------------------------------------------
    //
    // 	Protected Service Properties
    //
    // --------------------------------------------------------------------------

    protected abstract get settings(): T;

    protected abstract get theme(): ThemeService;
    protected abstract get language(): LanguageService;
    protected abstract get renderer(): Renderer2;
    protected abstract get dateAdapter(): DateAdapter<any>;
}
