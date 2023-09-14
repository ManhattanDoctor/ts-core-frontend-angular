import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AssetBackgroundDirective } from './AssetBackgroundDirective';
import { AssetBackgroundPipe } from './AssetBackgroundPipe';
import { AssetFilePipe } from './AssetFilePipe';
import { AssetIconPipe } from './AssetIconPipe';
import { AssetImagePipe } from './AssetImagePipe';
import { AssetSoundPipe } from './AssetSoundPipe';
import { AssetVideoPipe } from './AssetVideoPipe';

let declarations = [AssetImagePipe, AssetIconPipe, AssetFilePipe, AssetSoundPipe, AssetVideoPipe, AssetBackgroundPipe, AssetBackgroundDirective];

@NgModule({
    imports: [CommonModule],
    exports: declarations,
    declarations
})
export class AssetModule {}
