import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { PlatformService } from '../service/PlatformService';

@Directive({
    selector: '[viIsServer]'
})
export class IsServerDirective {
    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(platform: PlatformService, templateRef: TemplateRef<any>, viewContainer: ViewContainerRef) {
        if (platform.isPlatformServer) {
            viewContainer.createEmbeddedView(templateRef);
        }
    }
}
