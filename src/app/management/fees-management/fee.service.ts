import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Fee } from './fee.model';

@Injectable()
export class FeeService {
    private api: string;

    fees: Fee[] = [
        { id: '1', name: 'Hajj 2018', amount: 12333, categories: ['Hajj'] },
        { id: '2', name: 'Omra decembre 2018', amount: 4588, categories: ['Omra'] },
    ];

    constructor() {
        // this.api = config.ApiEndpoint + '/customers';
    }

    createServiceFee(fee: Fee) : Observable<Fee> {
        fee.id = new Date().getMilliseconds().toString();
        return of(fee);
    }
}

