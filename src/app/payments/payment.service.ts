import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Payment } from './payment.model';

@Injectable()
export class PaymentService {

  payments: Payment[] = [
    { id: '1', status: 'P', amountPaid: 1252, fees:1252, discount: 0, date: new Date(2018, 1, 2), customer: { id: '1', gender: 'M', firstname: 'Pierre', lastname: 'Paul', birthDate: new Date(1977, 1, 2), mobileNumber: '0665491705', email: 'pierre.paul@mail.fr' }},
    { id: '2', status: 'I', amountPaid: 1000, fees:1252, discount: 0, date: new Date(2018, 1, 2), customer: { id: '2', gender: 'M', firstname: 'Hamim', lastname: 'Ahmed', birthDate: new Date(1952, 1, 2), mobileNumber: '0667777777', email: 'hamim.ahmed@mail.fr' }},
  ];

  constructor() { }

  create(payment: Payment): Observable<Payment> {
    payment.id = new Date().getMilliseconds().toString();
    this.payments.unshift(payment);
    return of(payment);
  }

  createMultiple(payments: Payment[]): Observable<Payment[]> {
    payments.forEach(payment => {
      payment.id = new Date().getMilliseconds().toString();
      this.payments.unshift(payment);
    });
    return of(payments);
  }
}
