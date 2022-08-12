import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Injectable } from '@angular/core';
import { DestroyableContainer } from '@ts-core/common';

@Injectable({ providedIn: 'root' })
export class PlatformService extends DestroyableContainer {
    // --------------------------------------------------------------------------
    //
    // 	Constants
    //
    // --------------------------------------------------------------------------

    private _isPlatformServer: boolean;
    private _isPlatformBrowser: boolean;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(@Inject(PLATFORM_ID) platformId: string) {
        super();
        this._isPlatformServer = isPlatformServer(platformId);
        this._isPlatformBrowser = isPlatformBrowser(platformId);
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get isPlatformServer(): boolean {
        return this._isPlatformServer;
    }

    public get isPlatformBrowser(): boolean {
        return this._isPlatformBrowser;
    }
}
