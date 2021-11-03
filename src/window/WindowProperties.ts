import { MatDialogRef } from '@angular/material/dialog';
import { OverlayRef } from '@angular/cdk/overlay';
import { IWindowContent } from './IWindowContent';
import { WindowConfig } from './WindowConfig';

export interface WindowProperties<U = any> {
    reference?: MatDialogRef<IWindowContent<U>>;
    config?: WindowConfig;
    overlay?: OverlayRef;
}
