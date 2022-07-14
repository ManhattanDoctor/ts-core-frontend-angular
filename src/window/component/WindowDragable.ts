import { InteractEvent, DraggableOptions } from '@interactjs/types';
import { ViewUtil } from '../../util/ViewUtil';
import { WindowResizeable } from './WindowResizeable';

export class WindowDragable extends WindowResizeable {
    // --------------------------------------------------------------------------
    //
    //  Properties Methods
    //
    // --------------------------------------------------------------------------

    protected isWasDragged: boolean = false;

    private dragMoveHandlerProxy: (...args) => any;
    private dragStartHandlerProxy: (...args) => any;

    // --------------------------------------------------------------------------
    //
    //  Protected Methods
    //
    // --------------------------------------------------------------------------

    protected setProperties(): void {
        super.setProperties();

        if (this.config.isModal) {
            return;
        }
        ViewUtil.addClass(this.container, 'vi-draggable');
        if (!this.config.isContentDragable) {
            return;
        }
        this.dragMoveHandlerProxy = this.dragMoveHandler.bind(this);
        this.dragStartHandlerProxy = this.dragStartHandler.bind(this);

        let param = {} as DraggableOptions;
        // let param = {} as any;
        this.interactable.draggable(param);
        this.interactable.on('dragmove', this.dragMoveHandlerProxy);
        this.interactable.on('dragstart', this.dragStartHandlerProxy);
    }

    protected isNeedClickStopPropagation(event: MouseEvent): boolean {
        return this.isWasDragged || super.isNeedClickStopPropagation(event);
    }

    // --------------------------------------------------------------------------
    //
    //  Event Handlers
    //
    // --------------------------------------------------------------------------

    public dragStartHandler(event: InteractEvent): void {
        this.isWasDragged = true;
    }

    public dragMoveHandler(event: InteractEvent): void {
        let x = this.getX() + event.dx;
        let y = this.getY() + event.dy;
        this.move(x, y);
    }

    protected mouseClickHandler(event: MouseEvent): void {
        super.mouseClickHandler(event);
        this.isWasDragged = false;
    }

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

        this.dragMoveHandlerProxy = null;
        this.dragStartHandlerProxy = null;
    }
}
