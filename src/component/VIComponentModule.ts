import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VICommonModule } from '../VICommonModule';
import { LanguageSelectorComponent } from './language/language-selector/language-selector.component';
import { MenuListComponent } from './menu-list/menu-list.component';
import { SelectListComponent } from './select-list/select-list.component';
import { TabGroupComponent } from './tab-group/tab-group.component';

import { CdkTablePaginableComponent } from './cdk-table/cdk-table-paginable/cdk-table-paginable.component';
import { CdkTableFilterableComponent } from './cdk-table/cdk-table-filterable/cdk-table-filterable.component';
import { CdkTablePaginableBookmarkComponent } from './cdk-table/cdk-table-paginable-bookmark/cdk-table-paginable-bookmark.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { CdkTableColumnValuePipe } from './cdk-table/column/CdkTableColumnValuePipe';
import { CdkTableColumnStyleNamePipe } from './cdk-table/column/CdkTableColumnStyleNamePipe';
import { CdkTableColumnClassNamePipe } from './cdk-table/column/CdkTableColumnClassNamePipe';
import { CdkTableRowClassNamePipe } from './cdk-table/row/CdkTableRowClassNamePipe';
import { CdkTableRowStyleNamePipe } from './cdk-table/row/CdkTableRowStyleNamePipe';
import { CdkTableCellClassNamePipe } from './cdk-table/column/CdkTableCellClassNamePipe';

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
const ENTRY_COMPONENTS = [];
const DECLARATIONS = [
    CdkTableColumnValuePipe,
    CdkTableColumnClassNamePipe,
    CdkTableColumnStyleNamePipe,
    CdkTableRowStyleNamePipe,
    CdkTableRowClassNamePipe,
    CdkTableCellClassNamePipe,

    LanguageSelectorComponent,
    TabGroupComponent,
    MenuListComponent,
    SelectListComponent,
    CdkTablePaginableComponent,
    CdkTableFilterableComponent,
    CdkTablePaginableBookmarkComponent,
    ...ENTRY_COMPONENTS
];
const EXPORTS = [...DECLARATIONS];

@NgModule({
    imports: IMPORTS,
    declarations: DECLARATIONS,
    exports: EXPORTS,
    entryComponents: ENTRY_COMPONENTS
})
export class VIComponentModule {}
