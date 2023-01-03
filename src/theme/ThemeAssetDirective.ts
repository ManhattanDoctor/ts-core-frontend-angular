import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Destroyable } from '@ts-core/common';
import { Theme, ThemeAssetService, ThemeService } from '@ts-core/frontend';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs';
import { ViewUtil } from '../util/ViewUtil';

@Directive()
export abstract class ThemeAssetDirective<T extends HTMLElement = HTMLElement> extends Destroyable {
    // --------------------------------------------------------------------------
    //
    //	Properties
    //
    // --------------------------------------------------------------------------

    protected _name: string;
    protected _extension: string = 'png';

    protected _isFile: boolean = false;
    protected _isImage: boolean = false;
    protected _isVideo: boolean = false;
    protected _isSound: boolean = false;
    protected _isBackground: boolean = false;
    protected _isIgnoreTheme: boolean = true;

    protected source: string;
    protected element: T;

    private isTriedThemeDefault: boolean;

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(element: ElementRef, protected theme: ThemeService, protected themeAsset: ThemeAssetService) {
        super();
        this.element = ViewUtil.parseElement(element.nativeElement) as T;

        this.theme.changed.pipe(takeUntil(this.destroyed)).subscribe(() => {
            this.isTriedThemeDefault = false;
            this.setSourceProperties();
        });
    }

    // --------------------------------------------------------------------------
    //
    //	Private Methods
    //
    // --------------------------------------------------------------------------

    protected getSource(id: string): string {
        if (_.isNil(id)) {
            return null;
        }
        if (this.isImage) {
            return this.themeAsset.getImage(id, this.extension, this.isIgnoreTheme);
        }
        if (this.isBackground) {
            return this.themeAsset.getBackground(id, this.extension, this.isIgnoreTheme);
        }
        if (this.isSound) {
            return this.themeAsset.getSound(id, this.extension, this.isIgnoreTheme);
        }
        if (this.isVideo) {
            return this.themeAsset.getVideo(id, this.extension, this.isIgnoreTheme);
        }
        if (this.isFile) {
            return this.themeAsset.getFile(id, this.extension, this.isIgnoreTheme);
        }
        return this.themeAsset.getIcon(id, this.extension, this.isIgnoreTheme);
    }

    // --------------------------------------------------------------------------
    //
    //	Event Handlers
    //
    // --------------------------------------------------------------------------

    @HostListener('error', ['$event'])
    private errorLoadingHandler(event: ErrorEvent): void {
        this.errorHandler(event);
    }

    protected errorHandler(event: ErrorEvent): void {
        if (this.isTriedThemeDefault) {
            return;
        }
        this.isTriedThemeDefault = true;
        this.source = this.getSource(this.getDefaultSourceId());
        this.commitSourceProperties();
    }

    // --------------------------------------------------------------------------
    //
    //	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected setSourceProperties(): void {
        this.source = this.getSource(this.getSourceId(this.theme.theme));
        this.commitSourceProperties();
    }

    protected getSourceId(theme: Theme): string {
        return !_.isNil(theme) ? this.name + _.capitalize(theme.name) : null;
    }

    protected getDefaultSourceId(): string {
        return this.themeAsset.getName(this.name, this.isIgnoreTheme);
    }

    protected abstract commitSourceProperties(): void;

    protected abstract removeSourceProperties(): void;

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

        this.name = null;
        this.theme = null;
        this.element = null;
    }

    // --------------------------------------------------------------------------
    //
    //	Public Properties
    //
    // --------------------------------------------------------------------------

    @Input()
    public set isSound(value: boolean) {
        if (value === this._isSound) {
            return;
        }
        this._isSound = value;
        this.setSourceProperties();
    }
    public get isSound(): boolean {
        return this._isSound;
    }

    @Input()
    public set isVideo(value: boolean) {
        if (value === this._isVideo) {
            return;
        }
        this._isVideo = value;
        this.setSourceProperties();
    }
    public get isVideo(): boolean {
        return this._isVideo;
    }

    @Input()
    public set isFile(value: boolean) {
        if (value === this._isFile) {
            return;
        }
        this._isFile = value;
        this.setSourceProperties();
    }
    public get isFile(): boolean {
        return this._isFile;
    }

    @Input()
    public set isImage(value: boolean) {
        if (value === this._isImage) {
            return;
        }
        this._isImage = value;
        this.setSourceProperties();
    }
    public get isImage(): boolean {
        return this._isImage;
    }

    @Input()
    public set isBackground(value: boolean) {
        if (value === this._isBackground) {
            return;
        }
        this._isBackground = value;
        this.setSourceProperties();
    }
    public get isBackground(): boolean {
        return this._isBackground;
    }

    @Input()
    public set isIgnoreTheme(value: boolean) {
        if (value === this._isIgnoreTheme) {
            return;
        }
        this._isIgnoreTheme = value;
        this.setSourceProperties();
    }
    public get isIgnoreTheme(): boolean {
        return this._isIgnoreTheme;
    }

    public get name(): string {
        return this._name;
    }
    @Input()
    public set name(value: string) {
        if (value === this._name) {
            return;
        }
        if (!_.isNil(this._name)) {
            this.removeSourceProperties();
        }
        this._name = value;
        if (!_.isNil(value)) {
            this.setSourceProperties();
        }
    }

    public get extension(): string {
        return this._extension;
    }
    @Input()
    public set extension(value: string) {
        if (value === this._extension) {
            return;
        }
        this._extension = value;
        if (!_.isNil(value)) {
            this.setSourceProperties();
        }
    }
}
