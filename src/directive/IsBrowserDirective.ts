import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { PlatformService } from '../service/PlatformService';

@Directive({
    selector: '[viIsBrowser]'
})
export class IsBrowserDirective {
    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(platform: PlatformService, templateRef: TemplateRef<any>, viewContainer: ViewContainerRef) {
        if (platform.isPlatformBrowser) {
            viewContainer.createEmbeddedView(templateRef);
        }
    }
}
