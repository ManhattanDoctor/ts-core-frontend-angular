import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AssetBackgroundDirective } from './AssetBackgroundDirective';
import { AssetBackgroundPipe } from './AssetBackgroundPipe';
import { AssetFilePipe } from './AssetFilePipe';
import { AssetIconPipe } from './AssetIconPipe';
import { AssetImagePipe } from './AssetImagePipe';
import { AssetSoundPipe } from './AssetSoundPipe';
import { AssetVideoPipe } from './AssetVideoPipe';

@NgModule({
    imports: [CommonModule],
    declarations: [AssetBackgroundDirective, AssetImagePipe, AssetIconPipe, AssetFilePipe, AssetSoundPipe, AssetVideoPipe, AssetBackgroundPipe],
    exports: [AssetBackgroundDirective, AssetImagePipe, AssetIconPipe, AssetFilePipe, AssetSoundPipe, AssetVideoPipe, AssetBackgroundPipe]
})
export class AssetModule {}
