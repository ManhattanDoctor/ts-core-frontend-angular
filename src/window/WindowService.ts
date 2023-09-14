import { ObservableData, ClassType, Destroyable } from '@ts-core/common';
import { WindowConfigOptions } from './WindowConfig';
import { IWindow } from './IWindow';
import { Observable } from 'rxjs';
import { IWindowContent } from './IWindowContent';
import { IWindowConfig } from './IWindowConfig';
import { IQuestion, IQuestionOptions } from '../question/IQuestion';
import { WindowServiceEvent } from './WindowServiceEvent';

export abstract class WindowService extends Destroyable {
    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public abstract open<U extends IWindowContent<T>, T>(component: ClassType<U>, config: IWindowConfig<T>): U;

    public abstract get<T>(value: WindowId<T>): IWindowContent<T>;

    public abstract has<T>(value: WindowId<T>): boolean;

    public abstract setOnTop<T>(value: WindowId<T>): boolean;

    public abstract close<T>(value: WindowId<T>): void;

    public abstract closeAll(): void;

    // --------------------------------------------------------------------------
    //
    // 	Additional Methods
    //
    // --------------------------------------------------------------------------

    public abstract info(translationId?: string, translation?: any, questionOptions?: IQuestionOptions, configOptions?: WindowConfigOptions): IQuestion;

    public abstract question(translationId?: string, translation?: any, questionOptions?: IQuestionOptions, configOptions?: WindowConfigOptions): IQuestion;

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public abstract get events(): Observable<ObservableData<WindowServiceEvent, IWindow>>;

    public abstract get windows(): Map<IWindowConfig, IWindowContent>;
}

export type WindowId<T> = string | IWindowConfig<T>;
