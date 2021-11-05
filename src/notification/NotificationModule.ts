import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LanguageService } from '@ts-core/frontend/language';
import { LanguageModule } from '../language/LanguageModule';
import { NotificationComponent } from './component/notification/notification.component';
import { NotificationService } from './NotificationService';

const IMPORTS = [CommonModule, FormsModule, MatDialogModule, MatButtonModule, LanguageModule];
const ENTRY_COMPONENTS = [];
const DECLARATIONS = [NotificationComponent, ...ENTRY_COMPONENTS];

const EXPORTS = [...DECLARATIONS];
@NgModule({
    imports: IMPORTS,
    declarations: DECLARATIONS,
    exports: EXPORTS
})
export class NotificationModule {
    // --------------------------------------------------------------------------
    //
    // 	Static Methods
    //
    // --------------------------------------------------------------------------

    public static forRoot(): ModuleWithProviders<NotificationModule> {
        return {
            ngModule: NotificationService,
            providers: [
                {
                    provide: NotificationService,
                    deps: [MatDialog, LanguageService],
                    useClass: NotificationService
                }
            ]
        };
    }
}
