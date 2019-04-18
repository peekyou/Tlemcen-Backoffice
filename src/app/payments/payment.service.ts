import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Payment, PaymentType } from './payment.model';
import { AuthHttpService } from '../core/services/auth-http.service';
import { PagingResponse } from '../core/models/paging';

@Injectable()
export class PaymentService {
  resource = 'payments';

  constructor(private http: AuthHttpService) { }
  
  getPayments(page: number = null, count: number = null): Observable<PagingResponse<Payment>> {
    return this.http.get(this.resource + '?pageNumber=' + page + '&itemsCount=' + count);
  }

  getPayment(id): Observable<Payment> {
    return this.http.get(this.resource + '/' + id);
  }

  createPayment(payment: Payment): Observable<Payment> {
    return this.http.post(this.resource, payment);
  }

  deletePayment(id): Observable<Payment> {
    return this.http.delete(this.resource + '/' + id);
  }

  updatePayment(payment: Payment): Observable<Payment> {
    return this.http.put(this.resource + '/' + payment.id, payment);
  }

  getPaymentTypes(): Observable<PaymentType[]> {
    return this.http.get(this.resource + '/types');
  }
}
