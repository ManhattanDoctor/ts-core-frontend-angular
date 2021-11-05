import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LanguageService } from '@ts-core/frontend/language';
import { CookieModule } from '../cookie/CookieModule';
import { CookieService } from '../cookie/CookieService';
import { LanguageModule } from '../language/LanguageModule';
import { WindowService } from './WindowService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WindowDragAreaDirective } from './component/WindowDragAreaDirective';
import { WindowQuestionComponent } from './component/window-question/window-question.component';
import { WindowCloseElementComponent } from './component/window-close-element/window-close-element.component';
import { WindowResizeElementComponent } from './component/window-resize-element/window-resize-element.component';
import { WindowMinimizeElementComponent } from './component/window-minimize-element/window-minimize-element.component';
import { MatButtonModule } from '@angular/material/button';

const IMPORTS = [CommonModule, FormsModule, MatButtonModule, MatDialogModule, CookieModule, LanguageModule];
const ENTRY_COMPONENTS = [WindowQuestionComponent, WindowCloseElementComponent, WindowResizeElementComponent, WindowMinimizeElementComponent];
const DECLARATIONS = [WindowDragAreaDirective, ...ENTRY_COMPONENTS];
const EXPORTS = [...DECLARATIONS];

@NgModule({
    imports: IMPORTS,
    declarations: DECLARATIONS,
    exports: EXPORTS
})
export class WindowModule {
    // --------------------------------------------------------------------------
    //
    // 	Static Methods
    //
    // --------------------------------------------------------------------------

    public static forRoot(): ModuleWithProviders<WindowModule> {
        return {
            ngModule: WindowModule,
            providers: [
                {
                    provide: WindowService,
                    deps: [MatDialog, LanguageService, CookieService],
                    useClass: WindowService
                }
            ]
        };
    }
}
