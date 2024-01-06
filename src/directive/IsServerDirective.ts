import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { PlatformService } from '../service/PlatformService';
import { StructureDirective } from './StructureDirective';

@Directive({
    selector: '[viIsServer]'
})
export class IsServerDirective extends StructureDirective {
    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(templateRef: TemplateRef<any>, container: ViewContainerRef, platform: PlatformService) {
        super(templateRef, container);
        this.isNeedAdd = platform.isPlatformServer;
    }
}
