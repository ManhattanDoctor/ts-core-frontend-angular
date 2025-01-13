import { Injectable } from '@angular/core';
import {
    NoNewVersionDetectedEvent,
    SwUpdate,
    UnrecoverableStateEvent,
    VersionDetectedEvent,
    VersionInstallationFailedEvent,
    VersionReadyEvent
} from '@angular/service-worker';
import { Loadable, LoadableEvent, LoadableStatus, Logger, ObservableData } from '@ts-core/common';
import { takeUntil, filter } from 'rxjs';
import { NotificationService } from '../notification/NotificationService';
import * as _ from 'lodash';

@Injectable({ providedIn: 'root' })
export class ServiceWorkerService extends Loadable {
    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(
        protected updates: SwUpdate,
        protected logger: Logger,
        protected notifications: NotificationService
    ) {
        super();

        updates.unrecoverable.pipe(takeUntil(this.destroyed)).subscribe(event => this.unrecoverableHandler(event));
        updates.versionUpdates
            .pipe(
                filter(event => event.type === 'VERSION_READY'),
                takeUntil(this.destroyed)
            )
            .subscribe(event => this.readyHandler(event as VersionReadyEvent));
        updates.versionUpdates
            .pipe(
                filter(event => event.type === 'VERSION_DETECTED'),
                takeUntil(this.destroyed)
            )
            .subscribe(event => this.detectedHandler(event as VersionDetectedEvent));
        updates.versionUpdates
            .pipe(
                filter(event => event.type === 'NO_NEW_VERSION_DETECTED'),
                takeUntil(this.destroyed)
            )
            .subscribe(event => this.noNewVersionDetectedHandler(event as NoNewVersionDetectedEvent));
        updates.versionUpdates
            .pipe(
                filter(event => event.type === 'VERSION_INSTALLATION_FAILED'),
                takeUntil(this.destroyed)
            )
            .subscribe(event => this.installationFailedHandler(event as VersionInstallationFailedEvent));
    }

    //--------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    //--------------------------------------------------------------------------

    protected start(value: LoadableStatus): void {
        if (value === this.status) {
            return;
        }
        this.status = value;
        this.observer.next(new ObservableData(LoadableEvent.STARTED));
    }

    protected finish(value: LoadableStatus): void {
        if (value === this.status) {
            return;
        }
        this.status = value;
        this.observer.next(new ObservableData(LoadableEvent.FINISHED));
    }

    //--------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    //--------------------------------------------------------------------------

    protected async readyHandler(event: VersionReadyEvent): Promise<void> {
        this.start(LoadableStatus.LOADING);
        try {
            await this.updates.activateUpdate();
            this.finish(LoadableStatus.LOADED);
        } catch (error) {
            this.finish(LoadableStatus.ERROR);
            this.logger.error(`Unable to activate version: ${error}`);
        }
    }

    protected async unrecoverableHandler(event: UnrecoverableStateEvent): Promise<void> {
        this.finish(LoadableStatus.ERROR);
        this.logger.error(`Unable to update version: ${event.reason}`);
    }

    protected async detectedHandler(event: VersionDetectedEvent): Promise<void> {
        this.start(LoadableStatus.LOADING);
    }

    protected async installationFailedHandler(event: VersionInstallationFailedEvent): Promise<void> {
        this.finish(LoadableStatus.ERROR);
    }

    protected async noNewVersionDetectedHandler(event: NoNewVersionDetectedEvent): Promise<void> {
        this.finish(LoadableStatus.NOT_LOADED);
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public activateUpdate(): Promise<boolean> {
        return this.updates.activateUpdate();
    }

    public checkForUpdate(): Promise<boolean> {
        return this.updates.checkForUpdate();
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    //--------------------------------------------------------------------------

    public get isEnabled(): boolean {
        return this.updates.isEnabled;
    }
}
