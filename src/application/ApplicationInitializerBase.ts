import { Destroyable, ExtendedError } from '@ts-core/common';
import { Assets, AssetsCdnProvider, LanguageService, SettingsServiceBase, ThemeService } from '@ts-core/frontend';
import {
    ILanguageLoader,
    LanguagePreloadLoader,
    LanguageFileLoader,
    LanguageProxyLoader,
    ILanguageProjectSettings,
    LanguageLoadFunction
} from '@ts-core/language';
import { RouterServiceBase } from '../service/RouterServiceBase';
import { PlatformService } from '../service/PlatformService';
import { WindowService } from '../window/WindowService';
import axios from 'axios';
import * as _ from 'lodash';

export abstract class ApplicationInitializerBase<
    S extends SettingsServiceBase,
    R extends RouterServiceBase,
    T = any,
    O extends ServerInitializeOptions<T> = ServerInitializeOptions<T>
> extends Destroyable {
    //--------------------------------------------------------------------------
    //
    // 	Constructor
    //
    //--------------------------------------------------------------------------

    constructor(protected options?: O) {
        super();
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public async initialize(): Promise<void> {
        if (this.platform.isPlatformServer && _.isNil(this.options)) {
            throw new ExtendedError(`Unable to initialize: server platform requires options`);
        }

        try {
            this.settings.initialize(await this.getConfig(), this.router.getParams());
        } catch (error: any) {
            this.windows.info(error.message, null, null, { isDisableClose: true, isModal: true });
            return;
        }

        this.initializeAsset();
        this.initializeTheme();
        this.initializeLanguage();
    }

    //--------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    //--------------------------------------------------------------------------

    protected async initializeAsset(): Promise<void> {
        Assets.provider = new AssetsCdnProvider(this.settings.assetsUrl, this.settings.assetsCdnUrl);
    }

    protected async initializeTheme(): Promise<void> {
        this.theme.initialize(this.settings.themes);
    }

    //--------------------------------------------------------------------------
    //
    // 	Language Methods
    //
    //--------------------------------------------------------------------------

    protected async initializeLanguage(): Promise<void> {
        this.language.loader = await this.getLanguageLoader();
    }

    protected async getLanguageLoader<T = any>(): Promise<ILanguageLoader<T>> {
        if (this.platform.isPlatformServer) {
            return new LanguagePreloadLoader(this.options.locales);
        }
        let { url, project, proxy } = this.getLanguageLoadSettings();
        return this.settings.isProduction ? new LanguageProxyLoader(proxy) : new LanguageFileLoader(url, project.prefixes);
    }

    protected abstract getLanguageLoadSettings<T = any>(): ILanguageLoadSettings<T>;

    //--------------------------------------------------------------------------
    //
    // 	Config Methods
    //
    //--------------------------------------------------------------------------

    protected async getConfig(): Promise<any> {
        if (this.platform.isPlatformServer) {
            return this.options.config;
        }
        let local = await this.getConfigLocal();
        return Object.assign(local, await this.getConfigRemote(local));
    }

    protected async getConfigLocal<T = any>(): Promise<T> {
        return this.loadConfig('config.json');
    }

    protected async loadConfig<T = any>(url: string): Promise<T> {
        try {
            let { data } = await axios.get<T>(url);
            return data;
        } catch (error: any) {
            throw new ExtendedError(`Unable to load config from "${url}": ${error.message}`);
        }
    }

    protected abstract getConfigRemote<T = any>(local: any): Promise<T>;

    // --------------------------------------------------------------------------
    //
    // 	Protected Service Properties
    //
    // --------------------------------------------------------------------------

    protected abstract get theme(): ThemeService;
    protected abstract get windows(): WindowService;
    protected abstract get platform(): PlatformService;
    protected abstract get language(): LanguageService;

    protected abstract get router(): R;
    protected abstract get settings(): S;
}

export interface ILanguageLoadSettings<T = any> {
    url: string;
    proxy: LanguageLoadFunction<T>;
    project: ILanguageProjectSettings;
}

export abstract class ServerInitializeOptions<T = any> {
    config: T;
    locales: Map<string, any>;
}
