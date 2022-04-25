import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { ILogger, Logger, LoggerLevel } from '@ts-core/common/logger';
import { ICookieOptions } from '@ts-core/frontend/cookie';
import { ILanguageServiceOptions } from '@ts-core/frontend/language';
import { DefaultLogger } from '@ts-core/frontend/logger';
import { LoadingService, NativeWindowService } from '@ts-core/frontend/service';
import { IThemeServiceOptions } from '@ts-core/frontend/theme';
import * as _ from 'lodash';
import { AssetModule } from './asset/AssetModule';
import { CookieModule } from './cookie/CookieModule';
import { AspectRatioResizeDirective } from './directive/AspectRatioResizeDirective';
import { AutoScrollBottomDirective } from './directive/AutoScrollBottomDirective';
import { ClickToCopyDirective } from './directive/ClickToCopyDirective';
import { ClickToSelectDirective } from './directive/ClickToSelectDirective';
import { FocusDirective } from './directive/FocusDirective';
import { SelectOnFocusDirective } from './directive/SelectOnFocusDirective';
import { HTMLTitleDirective } from './directive/HTMLTitleDirective';
import { HTMLContentTitleDirective } from './directive/HTMLContentTitleDirective';
import { InfiniteScrollDirective } from './directive/InfiniteScrollDirective';
import { ResizeDirective } from './directive/ResizeDirective';
import { ScrollCheckDirective } from './directive/ScrollCheckDirective';
import { ScrollDirective } from './directive/ScrollDirective';
import { LanguageModule } from './language/LanguageModule';
import { BottomSheetModule } from './bottomSheet/BottomSheetModule';
import { NotificationModule } from './notification/NotificationModule';
import { CamelCasePipe } from './pipe/CamelCasePipe';
import { FinancePipe } from './pipe/FinancePipe';
import { MomentDateAdaptivePipe } from './pipe/MomentDateAdaptivePipe';
import { MomentDateFromNowPipe } from './pipe/MomentDateFromNowPipe';
import { MomentDatePipe } from './pipe/MomentDatePipe';
import { MomentTimePipe } from './pipe/MomentTimePipe';
import { NgModelErrorPipe } from './pipe/NgModelErrorPipe';
import { SanitizePipe } from './pipe/SanitizePipe';
import { StartCasePipe } from './pipe/StartCasePipe';
import { TimePipe } from './pipe/TimePipe';
import { TruncatePipe } from './pipe/TruncatePipe';
import { PrettifyPipe } from './pipe/PrettifyPipe';
import { ThemeModule } from './theme/ThemeModule';
import { WindowModule } from './window/WindowModule';
import { MenuTriggerForDirective } from './directive/MenuTriggerForDirective';

const IMPORTS = [CookieModule, ThemeModule, LanguageModule, AssetModule, WindowModule, NotificationModule];

const DECLARATIONS = [
    TimePipe,
    FinancePipe,
    SanitizePipe,
    TruncatePipe,
    PrettifyPipe,
    CamelCasePipe,
    StartCasePipe,
    NgModelErrorPipe,

    MomentDatePipe,
    MomentTimePipe,
    MomentDateFromNowPipe,
    MomentDateAdaptivePipe,

    FocusDirective,
    ResizeDirective,
    ScrollDirective,
    ScrollCheckDirective,
    ClickToCopyDirective,
    SelectOnFocusDirective,
    ClickToSelectDirective,
    MenuTriggerForDirective,
    InfiniteScrollDirective,
    HTMLTitleDirective,
    HTMLContentTitleDirective,
    AutoScrollBottomDirective,
    AspectRatioResizeDirective
];

@NgModule({
    imports: IMPORTS,
    declarations: DECLARATIONS,
    exports: [...IMPORTS, ...DECLARATIONS]
})
export class VICommonModule {
    // --------------------------------------------------------------------------
    //
    // 	Static Methods
    //
    // --------------------------------------------------------------------------

    public static forRoot(options?: IVICommonOptions): ModuleWithProviders<VICommonModule> {
        return {
            ngModule: VICommonModule,
            providers: [
                LoadingService,
                NativeWindowService,

                { provide: VI_ANGULAR_OPTIONS, useValue: options || {} },
                { provide: Logger, deps: [VI_ANGULAR_OPTIONS], useFactory: loggerServiceFactory },

                ...WindowModule.forRoot().providers,
                ...BottomSheetModule.forRoot().providers,
                ...NotificationModule.forRoot().providers,
                ...CookieModule.forRoot(options).providers,
                ...ThemeModule.forRoot(options ? options.themeOptions : null).providers,
                ...LanguageModule.forRoot(options ? options.languageOptions : null).providers
            ]
        };
    }
}

export class IVICommonOptions extends ICookieOptions {
    loggerLevel?: LoggerLevel;
    themeOptions?: IThemeServiceOptions;
    languageOptions?: ILanguageServiceOptions;
}

export function loggerServiceFactory(options: IVICommonOptions): ILogger {
    return new DefaultLogger(!_.isNil(options.loggerLevel) ? options.loggerLevel : LoggerLevel.LOG);
}

export const VI_ANGULAR_OPTIONS = new InjectionToken<IVICommonOptions>(`VI_ANGULAR_OPTIONS`);
