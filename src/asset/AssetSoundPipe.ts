import { Pipe, PipeTransform } from '@angular/core';
import { Assets } from '@ts-core/frontend';

@Pipe({
    name: 'viAssetSound',
    standalone: false
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
