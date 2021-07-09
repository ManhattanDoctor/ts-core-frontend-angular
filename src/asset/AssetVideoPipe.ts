import { Pipe, PipeTransform } from '@angular/core';
import { Assets } from '@ts-core/frontend/asset';

@Pipe({
    name: 'viAssetVideo'
})
export class AssetVideoPipe implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform(name: string, extension: string = 'mp4'): string {
        return Assets.getVideo(name, extension);
    }
}
