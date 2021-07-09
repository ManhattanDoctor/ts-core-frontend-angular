import { Directive, ElementRef, Input } from '@angular/core';
import { Destroyable } from '@ts-core/common';
import { Assets } from '@ts-core/frontend/asset';
import * as _ from 'lodash';
import { ViewUtil } from '../util/ViewUtil';

@Directive({
    selector: '[vi-asset-background]'
})
export class AssetBackgroundDirective extends Destroyable {
    // --------------------------------------------------------------------------
    //
    //	Properties
    //
    // --------------------------------------------------------------------------

    private _isUrl: boolean = false;
    private _isIcon: boolean = false;
    private _isImage: boolean = false;

    private _repeat: string = 'repeat';
    private _extension: string = 'png';
    private _background: string;

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(private element: ElementRef) {
        super();
    }

    // --------------------------------------------------------------------------
    //
    //	Private Methods
    //
    // --------------------------------------------------------------------------

    protected setStyleProperties(): void {
        let url = this.getUrl(this.background, this.isImage, this.isIcon, this.isUrl);
        ViewUtil.setBackground(this.element, url, this.repeat);
    }

    private getUrl(id: string, isImage?: boolean, isIcon?: boolean, isUrl?: boolean): string {
        if (_.isNil(id)) {
            return null;
        }
        if (isUrl) {
            return id;
        }
        if (isImage) {
            return Assets.getImage(id, this.extension);
        }
        if (isIcon) {
            return Assets.getIcon(id, this.extension);
        }
        return Assets.getBackground(id, this.extension);
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
        this.element = null;
    }

    // --------------------------------------------------------------------------
    //
    //	Public Properties
    //
    // --------------------------------------------------------------------------

    @Input()
    public set isIcon(value: boolean) {
        if (value === this._isIcon) {
            return;
        }
        this._isIcon = value;
        this.setStyleProperties();
    }
    public get isIcon(): boolean {
        return this._isIcon;
    }

    @Input()
    public set isImage(value: boolean) {
        if (value === this._isImage) {
            return;
        }
        this._isImage = value;
        this.setStyleProperties();
    }
    public get isImage(): boolean {
        return this._isImage;
    }

    @Input()
    public set isUrl(value: boolean) {
        if (value === this._isUrl) {
            return;
        }
        this._isUrl = value;
        this.setStyleProperties();
    }
    public get isUrl(): boolean {
        return this._isUrl;
    }

    @Input()
    public set repeat(value: string) {
        if (value === this._repeat) {
            return;
        }
        this._repeat = value;
        this.setStyleProperties();
    }
    public get repeat(): string {
        return this._repeat;
    }

    @Input()
    public set extension(value: string) {
        if (value === this._extension) {
            return;
        }
        this._extension = value;
        this.setStyleProperties();
    }
    public get extension(): string {
        return this._extension;
    }

    @Input('vi-asset-background')
    public set background(value: string) {
        if (value === this._background) {
            return;
        }
        this._background = value;
        this.setStyleProperties();
    }
    public get background(): string {
        return this._background;
    }
}
