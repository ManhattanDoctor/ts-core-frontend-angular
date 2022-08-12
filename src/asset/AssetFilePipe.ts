import { Pipe, PipeTransform } from '@angular/core';
import { Assets } from '@ts-core/frontend';

@Pipe({
    name: 'viAssetFile'
})
export class AssetFilePipe implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform(name: string, extension: string): string {
        return Assets.getFile(name, extension);
    }
}
