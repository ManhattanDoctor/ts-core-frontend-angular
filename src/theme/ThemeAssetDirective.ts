import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { Destroyable } from '@ts-core/common';
import { Assets } from '@ts-core/frontend/asset';
import { Theme, ThemeService, ThemeServiceEvent } from '@ts-core/frontend/theme';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ViewUtil } from '../util/ViewUtil';

@Directive({
    selector: '[vi-theme-asset]'
})
export class ThemeAssetDirective extends Destroyable implements OnInit {
    // --------------------------------------------------------------------------
    //
    //	Properties
    //
    // --------------------------------------------------------------------------

    @Input()
    public isImage: boolean = false;
    @Input()
    public isBackground: boolean = false;

    protected _name: string;
    protected _extension: string = 'png';

    protected source: string;
    protected element: HTMLElement;

    private isTriedThemeDefault: boolean;

    // --------------------------------------------------------------------------
    //
    //	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(element: ElementRef, protected theme: ThemeService) {
        super();
        this.element = ViewUtil.parseElement(element.nativeElement);

        this.theme.changed.pipe(takeUntil(this.destroyed)).subscribe(() => {
            this.isTriedThemeDefault = false;
            this.updateSourceProperties();
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
            return Assets.getImage(id, this.extension);
        }
        if (this.isBackground) {
            return Assets.getBackground(id, this.extension);
        }
        return Assets.getIcon(id, this.extension);
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
        this.source = this.getSource(this.getDefaultSourceId(this.theme.theme));
        this.commitSourceProperties();
    }

    // --------------------------------------------------------------------------
    //
    //	Protected Methods
    //
    // --------------------------------------------------------------------------

    protected updateSourceProperties(): void {
        this.source = this.getSource(this.getSourceId(this.theme.theme));
        this.commitSourceProperties();
    }

    protected getSourceId(theme: Theme): string {
        return !_.isNil(theme) ? this.name + _.capitalize(theme.name) : null;
    }

    protected getDefaultSourceId(theme: Theme): string {
        let value = this.name;
        value += theme.isDark ? 'Dark' : 'Light';
        return value;
    }

    protected commitSourceProperties(): void {}

    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public ngOnInit(): void {
        if (!_.isNil(this.theme.theme)) {
            this.updateSourceProperties();
        }
    }

    public destroy(): void {
        if (this.isDestroyed) {
            return;
        }
        super.destroy();

        this.theme = null;
        this.element = null;
    }

    // --------------------------------------------------------------------------
    //
    //	Public Properties
    //
    // --------------------------------------------------------------------------

    public get name(): string {
        return this._name;
    }
    @Input()
    public set name(value: string) {
        if (value === this._name) {
            return;
        }
        this._name = value;
        if (!_.isNil(this.name)) {
            this.updateSourceProperties();
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
        if (!_.isNil(this.extension)) {
            this.updateSourceProperties();
        }
    }
}
