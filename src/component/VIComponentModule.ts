import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
/*
import {
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule
} from '@angular/material';
*/
import { VICommonModule } from '../VICommonModule';
import { LanguageSelectorComponent } from './language/language-selector/language-selector.component';
import { NotificationComponent } from './notification/notification/notification.component';
import { CloseWindowElementComponent } from './window/close-window-element/close-window-element.component';
import { MinimizeWindowElementComponent } from './window/minimize-window-element/minimize-window-element.component';
import { QuestionComponent } from './window/question/question.component';
import { MenuListComponent } from './menu-list/menu-list.component';
import { SelectListComponent } from './select-list/select-list.component';
import { TabGroupComponent } from './tab-group/tab-group.component';
import { ResizeWindowElementComponent } from './window/resize-window-element/resize-window-element.component';
import { CdkTablePaginableComponent } from './cdk-table/cdk-table-paginable/cdk-table-paginable.component';
import { CdkTableFilterableComponent } from './cdk-table/cdk-table-filterable/cdk-table-filterable.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const IMPORTS = [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatButtonModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    VICommonModule
];
const ENTRY_COMPONENTS = [QuestionComponent, NotificationComponent, CloseWindowElementComponent, ResizeWindowElementComponent, MinimizeWindowElementComponent];
const DECLARATIONS = [
    LanguageSelectorComponent,
    TabGroupComponent,
    MenuListComponent,
    SelectListComponent,
    CdkTablePaginableComponent,
    CdkTableFilterableComponent,
    ...ENTRY_COMPONENTS
];
const EXPORTS = [...DECLARATIONS];

@NgModule({
    imports: IMPORTS,
    declarations: DECLARATIONS,
    entryComponents: ENTRY_COMPONENTS,
    exports: EXPORTS
})
export class VIComponentModule {}
