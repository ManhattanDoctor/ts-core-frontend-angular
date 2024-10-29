import { Injectable } from '@angular/core';
import {
    NoNewVersionDetectedEvent,
    SwUpdate,
    UnrecoverableStateEvent,
    VersionDetectedEvent,
    VersionEvent,
    VersionInstallationFailedEvent,
    VersionReadyEvent
} from '@angular/service-worker';
import { Loadable, LoadableEvent, LoadableStatus, Logger, ObservableData } from '@ts-core/common';
import { takeUntil, filter } from 'rxjs';
import * as _ from 'lodash';

@Injectable({ providedIn: 'root' })
export class ServiceWorkerService extends Loadable {
    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(protected updates: SwUpdate, protected logger: Logger) {
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

    protected start(status: LoadableStatus): void {
        this.status = status;
        this.observer.next(new ObservableData(LoadableEvent.STARTED));
    }

    protected finish(status: LoadableStatus): void {
        this.status = status;
        this.observer.next(new ObservableData(LoadableEvent.FINISHED));
    }

    //--------------------------------------------------------------------------
    //
    // 	Event Handlers
    //
    //--------------------------------------------------------------------------

    protected async readyHandler(event: VersionReadyEvent): Promise<void> {
        let status = null;
        try {
            await this.updates.activateUpdate();
            status = LoadableStatus.LOADED;
        } catch (error) {
            status = LoadableStatus.ERROR;
            this.logger.error(`Unable to activate version: ${error}`);
        } finally {
            this.finish(status);
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
        this.finish(LoadableStatus.LOADED);
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
