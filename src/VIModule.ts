import { APP_INITIALIZER, InjectionToken, ModuleWithProviders, NgModule, Renderer2, RendererFactory2 } from '@angular/core';
import { ILogger, Logger, LoggerLevel } from '@ts-core/common';
import { ICookieOptions } from '@ts-core/frontend';
import { ILanguageServiceOptions } from '@ts-core/frontend';
import { DefaultLogger } from '@ts-core/frontend';
import { LoadingService, NativeWindowService } from '@ts-core/frontend';
import { IThemeServiceOptions } from '@ts-core/frontend';
import { AssetModule } from './asset/AssetModule';
import { CookieModule } from './cookie/CookieModule';
import { CanDeactivateGuard } from './service/route/CanDeactivateGuard';
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
import { IsServerDirective } from './directive/IsServerDirective';
import { IsBrowserDirective } from './directive/IsBrowserDirective';
import { DOCUMENT } from '@angular/common';
import { PlatformService } from './service/PlatformService';
import { ViewUtil } from './util/ViewUtil';
import { CookieService } from './cookie/CookieService';
import { LoginTokenStorage } from './login/LoginTokenStorage';
import { LocalStorageService } from './storage/LocalStorageService';
import * as _ from 'lodash';

let imports = [CookieModule, ThemeModule, LanguageModule, AssetModule];

let declarations = [
    TimePipe,
    FinancePipe,
    SanitizePipe,
    TruncatePipe,
    PrettifyPipe,
    CamelCasePipe,
    StartCasePipe,
    NgModelErrorPipe,

    IsServerDirective,
    IsBrowserDirective,

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
    InfiniteScrollDirective,
    HTMLTitleDirective,
    HTMLContentTitleDirective,
    AutoScrollBottomDirective,
    AspectRatioResizeDirective
];

let exports = [...imports, ...declarations];

@NgModule({
    imports,
    declarations,
    exports
})
export class VIModule {
    // --------------------------------------------------------------------------
    //
    // 	Static Methods
    //
    // --------------------------------------------------------------------------

    public static forRoot(options?: IVIOptions): ModuleWithProviders<VIModule> {
        return {
            ngModule: VIModule,
            providers: [
                {
                    provide: APP_INITIALIZER,
                    deps: [NativeWindowService, RendererFactory2],
                    useFactory: initializerFactory,
                    multi: true
                },

                LoadingService,
                PlatformService,
                CanDeactivateGuard,

                { provide: VI_ANGULAR_OPTIONS, useValue: options || {} },
                { provide: Logger, deps: [VI_ANGULAR_OPTIONS], useFactory: loggerServiceFactory },
                { provide: NativeWindowService, deps: [DOCUMENT], useFactory: nativeWindowServiceFactory },
                { provide: LocalStorageService, deps: [NativeWindowService], useFactory: localStorageServiceFactory },
                { provide: LoginTokenStorage, deps: [LocalStorageService, CookieService], useFactory: loginTokenStorageServiceFactory },

                ...CookieModule.forRoot(options).providers,
                ...ThemeModule.forRoot(options ? options.themeOptions : null).providers,
                ...LanguageModule.forRoot(options ? options.languageOptions : null).providers
            ]
        };
    }
}

export class IVIOptions extends ICookieOptions {
    loggerLevel?: LoggerLevel;
    themeOptions?: IThemeServiceOptions;
    languageOptions?: ILanguageServiceOptions;
}

export function initializerFactory(nativeWindow: NativeWindowService, rendererFactory2: RendererFactory2): ViewUtil {
    ViewUtil.renderer = rendererFactory2.createRenderer(null, null);
    ViewUtil.document = nativeWindow.document;
    return () => Promise.resolve();
}

export function loggerServiceFactory(options: IVIOptions): ILogger {
    return new DefaultLogger(!_.isNil(options.loggerLevel) ? options.loggerLevel : LoggerLevel.ALL);
}

export function nativeWindowServiceFactory(document: Document): NativeWindowService {
    return new NativeWindowService(document);
}

export function localStorageServiceFactory(nativeWindow: NativeWindowService): LocalStorageService {
    return new LocalStorageService(nativeWindow);
}

export function loginTokenStorageServiceFactory(storage: LocalStorageService, cookies: CookieService): LoginTokenStorage {
    return new LoginTokenStorage(storage, cookies);
}

export const VI_ANGULAR_OPTIONS = new InjectionToken<IVIOptions>(`VI_ANGULAR_OPTIONS`);
