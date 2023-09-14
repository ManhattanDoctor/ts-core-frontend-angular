import { DateUtil } from '@ts-core/common';
import { ValueStorage } from './ValueStorage';
import * as _ from 'lodash';

export class DateValueStorage extends ValueStorage<Date> {
    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public defaultExpirationDelta: number = 0;

    //--------------------------------------------------------------------------
    //
    // 	Protected Methods
    //
    //--------------------------------------------------------------------------

    protected serialize(value: string): Date {
        return new Date(value);
    }

    protected deserialize(value: Date): string {
        return value.toISOString();
    }

    //--------------------------------------------------------------------------
    //
    // 	Public Methods
    //
    //--------------------------------------------------------------------------

    public isMore(item: Date): boolean {
        return this.has() ? this.get().getTime() > item.getTime() : false;
    }

    public isLess(item: Date): boolean {
        return this.has() ? this.get().getTime() < item.getTime() : false;
    }

    public isEqual(item: Date): boolean {
        return this.has() ? this.get().getTime() === item.getTime() : false;
    }

    public isExpired(item: Date): boolean {
        return this.has() ? this.isLess(item) : true;
    }

    public isExpiredFromNow(delta?: number): boolean {
        if (_.isNil(delta)) {
            delta = this.defaultExpirationDelta;
        }
        return this.isExpired(DateUtil.getDate(Date.now() + delta));
    }
}
