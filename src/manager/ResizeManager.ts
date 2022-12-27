// import { ResizeSensor } from 'css-element-queries';
import { IDestroyable } from '@ts-core/common';
import * as _ from 'lodash';
import { BehaviorSubject, distinctUntilChanged, Observable } from 'rxjs';
import { IViewElement, ViewUtil } from '../util/ViewUtil';

export class ResizeManager implements IDestroyable {
    // --------------------------------------------------------------------------
    //
    //  Static Methods
    //
    // --------------------------------------------------------------------------

    public static isSizeValid(item: ISize): boolean {
        if (_.isNil(item) || item.width <= 0 || item.height <= 0) {
            return false;
        }
        return true;
    }

    // --------------------------------------------------------------------------
    //
    //  Properties
    //
    // --------------------------------------------------------------------------

    protected size: ISize;
    protected sensor: ResizeObserver;
    protected subject: BehaviorSubject<ISize>;
    protected element: HTMLElement;

    // protected sensor: ResizeSensor;

    // --------------------------------------------------------------------------
    //
    //  Constructor
    //
    // --------------------------------------------------------------------------

    constructor(element: IViewElement) {
        this.element = ViewUtil.parseElement(element);
        this.subject = new BehaviorSubject({ width: ViewUtil.getWidth(this.element), height: ViewUtil.getHeight(this.element) });

        // this.sensor = new ResizeSensor(this.element, this.handler);
        // Could be undefined in ssr
        try {
            this.sensor = new ResizeObserver(this.handler2);
            this.sensor.observe(this.element);
        } catch (error) {}
    }

    // --------------------------------------------------------------------------
    //
    //  Event Handlers
    //
    // --------------------------------------------------------------------------

    protected handler = (item: ISize) => {
        if (!ResizeManager.isSizeValid(item)) {
            return;
        }
        if (!_.isNil(this.size) && item.width === this.size.width && item.height === this.size.height) {
            return;
        }
        this.size = item;
        this.subject.next(item);
    };

    protected handler2 = (items: Array<ResizeObserverEntry>) => {
        if (!_.isEmpty(items)) {
            this.handler(items[0].contentRect);
        }
    };

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
            this.sensor.unobserve(this.element);
            this.sensor.disconnect();
            this.sensor = null;
            /*
            this.sensor.detach(this.handler);
            try {
                this.sensor.reset();
            } catch (error) {}
            this.sensor = null;
            */
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
