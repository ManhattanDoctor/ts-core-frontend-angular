import { ResizeSensor } from 'css-element-queries';
import { IDestroyable } from '@ts-core/common';
import * as _ from 'lodash';
import { BehaviorSubject, distinctUntilChanged, Observable } from 'rxjs';
import { IViewElement, ViewUtil } from '../util/ViewUtil';

export class ResizeManager implements IDestroyable {
    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    protected sensor: ResizeSensor;
    protected subject: BehaviorSubject<ISize>;
    protected element: HTMLElement;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(element: IViewElement) {
        this.element = ViewUtil.parseElement(element);
        this.subject = new BehaviorSubject({ width: ViewUtil.getWidth(this.element), height: ViewUtil.getHeight(this.element) });
        this.sensor = new ResizeSensor(this.element, this.handler);
    }

    // --------------------------------------------------------------------------
    //
    //  Event Handlers
    //
    // --------------------------------------------------------------------------

    protected handler = (item: ISize) => this.subject.next(item);

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public get changed(): Observable<ISize> {
        return this.subject.asObservable().pipe(distinctUntilChanged(_.isEqual));
    }

    public get value(): ISize {
        return this.subject.getValue();
    }

    // --------------------------------------------------------------------------
    //
    //  Public Methods
    //
    // --------------------------------------------------------------------------

    public destroy(): void {
        if (!_.isNil(this.sensor)) {
            this.sensor.detach(this.handler);
            this.sensor.reset();
            this.sensor = null;
        }
        if (!_.isNil(this.subject)) {
            this.subject.complete();
            this.subject = null;
        }
        this.element = null;
    }
}

export interface ISize {
    width: number;
    height: number;
}
