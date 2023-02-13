import { ObservableData, ClassType, Destroyable } from '@ts-core/common';
import { WindowConfigOptions } from '../window/WindowConfig';
import { IWindow } from '../window/IWindow';
import { Observable } from 'rxjs';
import { IWindowContent } from '../window/IWindowContent';
import { IWindowConfig } from '../window/IWindowConfig';
import { IQuestion, IQuestionOptions } from '../question/IQuestion';
import { WindowServiceEvent } from '../window/WindowServiceEvent';
import { WindowId } from '../window/WindowService';

export abstract class BottomSheetService extends Destroyable {
    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public abstract open<U extends IWindowContent<T>, T>(component: ClassType<U>, config: IWindowConfig<T>): U;

    public abstract close(): void;

    // --------------------------------------------------------------------------
    //
    // 	Additional Methods
    //
    // --------------------------------------------------------------------------

    public abstract info(translationId?: string, translation?: any, questionOptions?: IQuestionOptions, configOptions?: WindowConfigOptions): IQuestion;

    public abstract question(translationId?: string, translation?: any, questionOptions?: IQuestionOptions, configOptions?: WindowConfigOptions): IQuestion;

    public abstract setOnTop<T>(value: WindowId<T>): boolean;

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public abstract get window(): IWindow;

    public abstract get events(): Observable<ObservableData<WindowServiceEvent, IWindow>>;
}
