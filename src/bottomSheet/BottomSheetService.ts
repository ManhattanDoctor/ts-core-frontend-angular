import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatBottomSheet, MatBottomSheetConfig, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Destroyable } from '@ts-core/common';
import { ObservableData } from '@ts-core/common/observer';
import { LanguageService } from '@ts-core/frontend/language';
import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';
import { WindowFactory } from '../window/WindowFactory';
import { IWindow } from '../window/IWindow';
import { BottomSheetBaseComponent } from './component/BottomSheetBaseComponent';
import { WindowConfig, WindowConfigOptions } from '../window/WindowConfig';
import { IWindowContent } from '../window/IWindowContent';
import { WindowServiceEvent } from '../window/WindowService';
import { QuestionManager } from '../question/QuestionManager';
import { IQuestion, IQuestionOptions, QuestionMode } from '../question/IQuestion';
import { WindowQuestionComponent } from '../window/component/window-question/window-question.component';

@Injectable({ providedIn: 'root' })
export class BottomSheetService extends Destroyable {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    public factory: WindowFactory<IWindow>;
    public questionComponent: ComponentType<IWindowContent>;

    protected dialog: MatBottomSheet;
    protected language: LanguageService;

    private observer: Subject<ObservableData<WindowServiceEvent, IWindow>>;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(dialog: MatBottomSheet, language: LanguageService) {
        super();
        this.dialog = dialog;
        this.language = language;
        this.observer = new Subject();

        this.factory = new WindowFactory(BottomSheetBaseComponent);
        this.questionComponent = WindowQuestionComponent;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public open<T extends IWindowContent>(component: ComponentType<T>, config: WindowConfig): T {
        let reference: MatBottomSheetRef<T> = this.dialog.open(component, config as MatBottomSheetConfig<T>);

        let window = this.factory.create({ config, reference: reference as any, overlay: (reference as any)._overlayRef });
        let subscription = window.events.subscribe(event => {
            switch (event) {
                case WindowServiceEvent.OPENED:
                    this.observer.next(new ObservableData(WindowServiceEvent.OPENED, window));
                    break;

                case WindowServiceEvent.CLOSED:
                    subscription.unsubscribe();
                    this.observer.next(new ObservableData(WindowServiceEvent.CLOSED, window));
                    break;
            }
        });
        return window.content as T;
    }

    public removeAll(): void {}

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.removeAll();

        if (!_.isNil(this.observer)) {
            this.observer.complete();
            this.observer = null;
        }

        this.factory = null;
        this.questionComponent = null;

        this.dialog = null;
        this.language = null;
    }

    // --------------------------------------------------------------------------
    //
    // 	Additional Methods
    //
    // --------------------------------------------------------------------------

    public info(translationId?: string, translation?: any, questionOptions?: IQuestionOptions, configOptions?: WindowConfigOptions): IQuestion {
        let text = this.language.translate(translationId, translation);
        let config: WindowConfig<QuestionManager> = _.assign(new WindowConfig(true, false, 450), configOptions);
        config.data = new QuestionManager(_.assign(questionOptions, { mode: QuestionMode.INFO, text }));
        return this.open(this.questionComponent, config).config.data;
    }

    public question(translationId?: string, translation?: any, questionOptions?: IQuestionOptions, configOptions?: WindowConfigOptions): IQuestion {
        let text = this.language.translate(translationId, translation);
        let config: WindowConfig<QuestionManager> = _.assign(new WindowConfig(true, false, 450), configOptions);
        config.data = new QuestionManager(_.assign(questionOptions, { mode: QuestionMode.QUESTION, text }));
        return this.open(this.questionComponent, config).config.data;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get events(): Observable<ObservableData<WindowServiceEvent, IWindow>> {
        return this.observer.asObservable();
    }
}
