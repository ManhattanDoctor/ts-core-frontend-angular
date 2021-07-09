import { DataSourceMapCollection, DataSourceMapCollectionEvent } from '@ts-core/common/map/dataSource';
import * as _ from 'lodash';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DestroyableContainer, LoadableEvent } from '@ts-core/common';

export class CdkTableDataSource<U> extends DestroyableContainer {
    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    protected subject: BehaviorSubject<Array<U>>;
    protected subscription: Subscription;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(protected map: DataSourceMapCollection<U>) {
        super();

        this.subject = new BehaviorSubject(map.collection);
        map.events.pipe(takeUntil(this.destroyed)).subscribe(data => {
            switch (data.type) {
                case LoadableEvent.COMPLETE:
                    this.parseResponse();
                    break;
                case DataSourceMapCollectionEvent.DATA_LOADED_AND_PARSED:
                    this.parseParsedResponse();
                    break;
            }
        });
    }

    // --------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected parseResponse(): void {
        this.subject.next(this.map.collection);
    }

    protected parseParsedResponse(): void {}

    // --------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    // --------------------------------------------------------------------------

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();

        this.subject.complete();
        this.subject = null;

        this.map = null;
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get dataSource(): Observable<Array<U>> {
        return this.subject.asObservable();
    }
}
