import { Pipe, PipeTransform } from '@angular/core';
import { Assets } from '@ts-core/frontend/asset';

@Pipe({
    name: 'viAssetSound'
})
export class AssetSoundPipe implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform(name: string, extension: string = 'mp3'): string {
        return Assets.getSound(name, extension);
    }
}
