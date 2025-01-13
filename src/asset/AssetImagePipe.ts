import { Pipe, PipeTransform } from '@angular/core';
import { Assets } from '@ts-core/frontend';

@Pipe({
    name: 'viAssetImage',
    standalone: false
})
export class AssetImagePipe implements PipeTransform {
    // --------------------------------------------------------------------------
    //
    //	Public Methods
    //
    // --------------------------------------------------------------------------

    public transform(name: string, extension: string = 'png'): string {
        return Assets.getImage(name, extension);
    }
}
