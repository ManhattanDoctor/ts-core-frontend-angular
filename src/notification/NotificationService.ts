import { ObservableData, ClassType, Destroyable } from '@ts-core/common';
import { IQuestion, IQuestionOptions } from '../question/IQuestion';
import { INotification } from './INotification';
import { INotificationConfig } from './INotificationConfig';
import { INotificationContent } from './INotificationContent';
import { NotificationConfigOptions } from './NotificationConfig';
import { NotificationServiceEvent } from './NotificationServiceEvent';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export abstract class NotificationService extends Destroyable {
    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public abstract open<U extends INotificationContent<T>, T>(component: ClassType<U>, config: INotificationConfig<T>): U;

    // --------------------------------------------------------------------------
    //
    // 	Help Methods
    //
    // --------------------------------------------------------------------------

    public abstract get<T>(value: NotificationId<T>): INotificationConfig<T>;

    public abstract has<T>(value: NotificationId<T>): boolean;

    public abstract remove<T>(value: NotificationId<T>): void;

    public abstract closeAll(): void;

    public abstract close<T>(value: NotificationId<T>): INotification<T>;

    // --------------------------------------------------------------------------
    //
    // 	Additional Methods
    //
    // --------------------------------------------------------------------------

    public abstract info(translationId?: string, translation?: any, questionOptions?: IQuestionOptions, configOptions?: NotificationConfigOptions): IQuestion;

    public abstract question(
        translationId?: string,
        translation?: any,
        questionOptions?: IQuestionOptions,
        configOptions?: NotificationConfigOptions
    ): IQuestion;

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public abstract get events(): Observable<ObservableData<NotificationServiceEvent, INotificationConfig | INotification>>;

    public abstract get configs(): Array<INotificationConfig>;

    public abstract get closedConfigs(): Array<INotificationConfig>;

    public abstract get notifications(): Map<INotificationConfig, INotificationContent>;
}

export type NotificationId<T> = string | INotificationConfig<T> | NotificationConfigOptions<T>;
