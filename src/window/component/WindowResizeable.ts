import { EdgeOptions, Interactable, InteractEvent, ResizableOptions } from '@interactjs/types/types';
import * as interact from 'interactjs';
import { ViewUtil } from '../../util/ViewUtil';
import { WindowImpl } from '../WindowImpl';
import * as _ from 'lodash';

export class WindowResizeable extends WindowImpl {
    // --------------------------------------------------------------------------
    //
    //  Properties Methods
    //
    // --------------------------------------------------------------------------

    private _interactable: Interactable;
    private resizeMoveHandlerProxy: (...args) => any;

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected setProperties(): void {
        super.setProperties();

        if (!this.config.isResizeable) {
            return;
        }

        ViewUtil.addClass(this.container, 'resizeable');
        if (_.isNil(this.resizeMoveHandlerProxy)) {
            this.resizeMoveHandlerProxy = this.resizeMoveHandler.bind(this);
        }

        let edges = {} as EdgeOptions;
        edges.top = true;
        edges.left = true;
        edges.right = true;
        edges.bottom = true;

        let param = {} as ResizableOptions;
        param.edges = edges;

        this.interactable.resizable(param);
        this.interactable.on('resizemove', this.resizeMoveHandlerProxy);
    }

    // --------------------------------------------------------------------------
    //
    //  Event Handlers
    //
    // --------------------------------------------------------------------------

    protected resizeMoveHandler(event: InteractEvent): void {
        if (this.isMinimized) {
            return;
        }

        let isChanged = event.dx !== 0 || event.dy !== 0;
        if (!isChanged) {
            return;
        }

        if (event.dx !== 0) {
            let width = this.getWidth();
            if (_.isNaN(width)) {
                width = this.calculateWidth();
            }
            this.setWidth(width + event.dx, false);
        }
        if (event.dy !== 0) {
            let height = this.getHeight();
            if (_.isNaN(height)) {
                height = this.calculateHeight();
            }
            this.setHeight(height + event.dy, false);
        }
        this.resizeHandler();
    }

    // --------------------------------------------------------------------------
    //
    //  Public Properties
    //
    // --------------------------------------------------------------------------

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.resizeMoveHandlerProxy = null;

        if (!_.isNil(this._interactable)) {
            this._interactable.unset();
            this._interactable = null;
        }
    }

    // --------------------------------------------------------------------------
    //
    //  Private Properties
    //
    // --------------------------------------------------------------------------

    protected get interactable(): Interactable {
        if (_.isNil(this._interactable)) {
            this._interactable = interact.default(this.container);
            // this._interactable.styleCursor(false);
        }
        return this._interactable;
    }
}
