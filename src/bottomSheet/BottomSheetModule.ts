import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { LanguageModule } from '../language/LanguageModule';
import { BottomSheetService } from './BottomSheetService';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

const IMPORTS = [CommonModule, FormsModule, MatBottomSheetModule, MatButtonModule, LanguageModule];
const ENTRY_COMPONENTS = [];
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
            ngModule: BottomSheetModule,
            providers: [BottomSheetService]
        };
    }
}
