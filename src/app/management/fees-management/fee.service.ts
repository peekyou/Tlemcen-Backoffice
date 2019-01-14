import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Fee } from './fee.model';
import { PagingResponse } from '../../core/models/paging';
import { AuthHttpService } from '../../core/services/auth-http.service';

@Injectable()
export class FeeService {
    resource = 'fees';
    
    constructor(private http: AuthHttpService) { }
    
    getFees(page: number, count: number): Observable<PagingResponse<Fee>> {
        return this.http.get(this.resource + '?pageNumber=' + page + '&itemsCount=' + count);
    }

    getFeesByCategory(category): Observable<Fee[]> {
        if (!category) {
            return of([]);
        }
        return this.http.get(this.resource + '/category/' + category);
    }

    getFee(id): Observable<Fee> {
        return this.http.get(this.resource + '/' + id);
    }

    createFee(fee: Fee) : Observable<Fee> {
        return this.http.post(this.resource, fee);
    }

    updateFee(fee: Fee): Observable<Fee> {
        return this.http.put(this.resource + '/' + fee.id, fee);
    }
    
    deleteFee(id: string) : Observable<boolean> {
        return this.http.delete(this.resource + '/' + id);
    }
}

