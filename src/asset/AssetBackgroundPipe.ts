import { Pipe, PipeTransform } from '@angular/core';
import { Assets } from '@ts-core/frontend';

@Pipe({
    name: 'viAssetBackground',
    standalone: false
})
export class AssetBackgroundPipe implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform(name: string, extension: string = 'png'): string {
        return Assets.getBackground(name, extension);
    }
}
