import { EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';
import * as _ from 'lodash';

export class StructureDirective<T = any> extends DestroyableContainer {
    //--------------------------------------------------------------------------
    //
    //	Properties
    //
    //--------------------------------------------------------------------------

    protected view: EmbeddedViewRef<T>;
    protected _isNeedAdd: boolean;

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(protected template: TemplateRef<T>, protected container: ViewContainerRef) {
        super();
    }

    protected commitIsNeedAddProperties(): void {
        if (this.isDestroyed) {
            return;
        }

        let isNeedAdd = false;
        let isNeedRemove = false;
        if (this.isNeedAdd) {
            if (_.isNil(this.view)) {
                isNeedAdd = true;
            }
        } else {
            if (!_.isNil(this.view)) {
                isNeedRemove = true;
            }
        }

        if (isNeedAdd) {
            this.view = this.container.createEmbeddedView(this.template);
        } else if (isNeedRemove) {
            let index = this.container.indexOf(this.view);
            if (index >= 0) {
                this.container.remove(index);
                this.view = null;
            }
        }
    }

    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();
        this.view = null;
        this.template = null;
        this.container = null;
    }

    //--------------------------------------------------------------------------
    //
    //	Protected Properties
    //
    //--------------------------------------------------------------------------

    protected set isNeedAdd(value: boolean) {
        if (value == this._isNeedAdd) {
            return;
        }
        this._isNeedAdd = value;
        this.commitIsNeedAddProperties();
    }
    protected get isNeedAdd(): boolean {
        return this._isNeedAdd;
    }
}
