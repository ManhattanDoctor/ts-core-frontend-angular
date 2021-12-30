import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { LanguageService } from '@ts-core/frontend/language';
import { LanguageModule } from '../language/LanguageModule';
import { BottomSheetService } from './BottomSheetService';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { BottomSheetCloseElementComponent } from './component/bottom-sheet-close-element/bottom-sheet-close-element.component';

const IMPORTS = [CommonModule, FormsModule, MatBottomSheetModule, MatButtonModule, LanguageModule];
const ENTRY_COMPONENTS = [BottomSheetCloseElementComponent];
const DECLARATIONS = [...ENTRY_COMPONENTS];

const EXPORTS = [...DECLARATIONS];
@NgModule({
    imports: IMPORTS,
    declarations: DECLARATIONS,
    exports: EXPORTS
})
export class BottomSheetModule {
    // --------------------------------------------------------------------------
    //
    // 	Static Methods
    //
    // --------------------------------------------------------------------------

    public static forRoot(): ModuleWithProviders<BottomSheetModule> {
        return {
            ngModule: BottomSheetService,
            providers: [
                {
                    provide: BottomSheetService,
                    deps: [MatBottomSheet, LanguageService],
                    useClass: BottomSheetService
                }
            ]
        };
    }
}
