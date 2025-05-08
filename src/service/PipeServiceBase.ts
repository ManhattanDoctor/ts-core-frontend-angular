import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { Destroyable } from '@ts-core/common';
import { LanguageService } from '@ts-core/frontend';
import { takeUntil } from 'rxjs';
import { CamelCasePipe } from '../pipe/CamelCasePipe';
import { FinancePipe } from '../pipe/FinancePipe';
import { MomentDateAdaptivePipe } from '../pipe/MomentDateAdaptivePipe';
import { MomentDateFromNowPipe } from '../pipe/MomentDateFromNowPipe';
import { MomentDatePipe } from '../pipe/MomentDatePipe';
import { MomentTimePipe } from '../pipe/MomentTimePipe';
import { PrettifyPipe } from '../pipe/PrettifyPipe';
import { SanitizePipe } from '../pipe/SanitizePipe';
import { TimePipe } from '../pipe/TimePipe';
import { TruncatePipe } from '../pipe/TruncatePipe';

export class PipeServiceBase extends Destroyable {
    // --------------------------------------------------------------------------
    //
    // 	Constants
    //
    // --------------------------------------------------------------------------

    private static DATE: DatePipe = null;
    private static TIME: TimePipe = null;
    private static FINANCE: FinancePipe = null;
    private static PRETTIFY: PrettifyPipe = null;
    private static TRUNCATE: TruncatePipe = null;
    private static SANITIZE: SanitizePipe = null;

    private static CAMEL_CASE: CamelCasePipe = null;

    private static MOMENT_TIME: MomentTimePipe = null;
    private static MOMENT_DATE: MomentDatePipe = null;
    private static MOMENT_DATE_FROM_NOW: MomentDateFromNowPipe = null;
    private static MOMENT_ADAPTIVE_DATE: MomentDateAdaptivePipe = null;

    // --------------------------------------------------------------------------
    //
    // 	Properties
    //
    // --------------------------------------------------------------------------

    private _locale: string;

    // --------------------------------------------------------------------------
    //
    // 	Constructor
    //
    // --------------------------------------------------------------------------

    constructor(
        public language: LanguageService,
        public sanitizer: DomSanitizer
    ) {
        super();

        if (this.language.isLoaded) {
            this.commitLanguageProperties();
        }
        this.language.completed.pipe(takeUntil(this.destroyed)).subscribe(() => this.commitLanguageProperties());
    }

    // --------------------------------------------------------------------------
    //
    // 	Private Methods
    //
    // --------------------------------------------------------------------------

    protected commitLanguageProperties(): void {
        let locale = this.language.locale ? this.language.locale : 'en';
        this._locale = locale === 'en' ? 'en-US' : locale;

        if (PipeServiceBase.DATE) {
            PipeServiceBase.DATE = new DatePipe(this.locale);
        }
    }

    // --------------------------------------------------------------------------
    //
    // 	Public Properties
    //
    // --------------------------------------------------------------------------

    public get date(): DatePipe {
        if (!PipeServiceBase.DATE) {
            PipeServiceBase.DATE = new DatePipe(this.locale);
        }
        return PipeServiceBase.DATE;
    }

    public get time(): TimePipe {
        if (!PipeServiceBase.TIME) {
            PipeServiceBase.TIME = new TimePipe();
        }
        return PipeServiceBase.TIME;
    }

    public get finance(): FinancePipe {
        if (!PipeServiceBase.FINANCE) {
            PipeServiceBase.FINANCE = new FinancePipe();
        }
        return PipeServiceBase.FINANCE;
    }

    public get truncate(): TruncatePipe {
        if (!PipeServiceBase.TRUNCATE) {
            PipeServiceBase.TRUNCATE = new TruncatePipe();
        }
        return PipeServiceBase.TRUNCATE;
    }

    public get prettify(): PrettifyPipe {
        if (!PipeServiceBase.PRETTIFY) {
            PipeServiceBase.PRETTIFY = new PrettifyPipe();
        }
        return PipeServiceBase.PRETTIFY;
    }

    public get momentDate(): MomentDatePipe {
        if (!PipeServiceBase.MOMENT_DATE) {
            PipeServiceBase.MOMENT_DATE = new MomentDatePipe();
        }
        return PipeServiceBase.MOMENT_DATE;
    }

    public get momentDateFromNow(): MomentDateFromNowPipe {
        if (!PipeServiceBase.MOMENT_DATE_FROM_NOW) {
            PipeServiceBase.MOMENT_DATE_FROM_NOW = new MomentDateFromNowPipe();
        }
        return PipeServiceBase.MOMENT_DATE_FROM_NOW;
    }

    public get momentDateAdaptive(): MomentDateAdaptivePipe {
        if (!PipeServiceBase.MOMENT_ADAPTIVE_DATE) {
            PipeServiceBase.MOMENT_ADAPTIVE_DATE = new MomentDateAdaptivePipe();
        }
        return PipeServiceBase.MOMENT_ADAPTIVE_DATE;
    }

    public get momentTime(): MomentTimePipe {
        if (!PipeServiceBase.MOMENT_TIME) {
            PipeServiceBase.MOMENT_TIME = new MomentTimePipe();
        }
        return PipeServiceBase.MOMENT_TIME;
    }

    public get sanitize(): SanitizePipe {
        if (!PipeServiceBase.SANITIZE) {
            PipeServiceBase.SANITIZE = new SanitizePipe(this.sanitizer);
        }
        return PipeServiceBase.SANITIZE;
    }

    public get camelCase(): CamelCasePipe {
        if (!PipeServiceBase.CAMEL_CASE) {
            PipeServiceBase.CAMEL_CASE = new CamelCasePipe();
        }
        return PipeServiceBase.CAMEL_CASE;
    }

    public get locale(): string {
        return this._locale;
    }
}
