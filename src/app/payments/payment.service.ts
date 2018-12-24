import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Payment } from './payment.model';
import { AuthHttpService } from '../core/services/auth-http.service';
import { PagingResponse } from '../core/models/paging';

@Injectable()
export class PaymentService {
  resource = 'payments';

  // payments: Payment[] = [
  //   { id: '1', status: 'P', amountPaid: 1252, fees:1252, discount: 0, date: new Date(2018, 1, 2), payment: { id: '1', gender: 'M', firstname: 'Pierre', lastname: 'Paul', birthDate: new Date(1977, 1, 2), mobileNumber: '0665491705', email: 'pierre.paul@mail.fr' }},
  //   { id: '2', status: 'I', amountPaid: 1000, fees:1252, discount: 0, date: new Date(2018, 1, 2), payment: { id: '2', gender: 'M', firstname: 'Hamim', lastname: 'Ahmed', birthDate: new Date(1952, 1, 2), mobileNumber: '0667777777', email: 'hamim.ahmed@mail.fr' }},
  // ];

  constructor(private http: AuthHttpService) { }
  
  getPayments(page: number = null, count: number = null, searchTerm: string = ''): Observable<PagingResponse<Payment>> {
    return this.http.get(this.resource + '?pageNumber=' + page + '&itemsCount=' + count+ '&searchTerm=' + searchTerm);
  }

  getPayment(id): Observable<Payment> {
    return this.http.get(this.resource + '/' + id);
  }

  createPayment(payment: Payment): Observable<Payment> {
    return this.http.post(this.resource, payment);
  }

  createMultiple(payments: Payment[]): Observable<Payment[]> {
    payments.forEach(payment => {
      payment.id = new Date().getMilliseconds().toString();
      // this.payments.unshift(payment);
    });
    return of(payments);
  }
}
