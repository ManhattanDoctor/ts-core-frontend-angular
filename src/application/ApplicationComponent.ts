import { LoadableEvent } from '@ts-core/common';
import { LanguageService } from '@ts-core/frontend';
import { filter, takeUntil } from 'rxjs';
import { ApplicationComponentBase } from './ApplicationComponentBase';
import moment from 'moment';
import numeral from 'numeral';
import * as _ from 'lodash';

export abstract class ApplicationComponent extends ApplicationComponentBase {
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
        this.initializeLanguage();
    }

    protected initializeLanguage(): void {
        this.language.events
            .pipe(
                filter(item => item.type === LoadableEvent.ERROR),
                takeUntil(this.destroyed)
            )
            .subscribe(item => this.languageLoadingError(item.data.toString(), item.error));
        this.language.completed.pipe(takeUntil(this.destroyed)).subscribe(item => this.languageLoadingComplete(item));
    }

    protected isReady(): boolean {
        return super.isReady() && this.isLanguageLoaded;
    }

    // --------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    // --------------------------------------------------------------------------

    protected languageLoadingComplete(locale: string): void {
        this.isLanguageLoaded = true;
        this.setLocale(locale);
        this.checkReady();
    }

    protected abstract languageLoadingError(locale: string, error: Error): void;

    protected viewReadyHandler(): void {
        this.initialize();
    }

    protected setLocale(item: string): void {
        moment.locale(item);
        numeral.locale(item);
    }

    // --------------------------------------------------------------------------
    //
    // 	Protected Service Properties
    //
    // --------------------------------------------------------------------------

    protected abstract get language(): LanguageService;
}
