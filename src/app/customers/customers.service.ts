import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Customer } from './customer.model';

@Injectable()
export class CustomersService {

  customers: Customer[] = [
    { id: '1', gender: 'M', firstname: 'Pierre', lastname: 'Paul', birthdate: new Date(1977, 1, 2), mobileNumber: '0665491705', email: 'pierre.paul@mail.fr', address: {} },
    { id: '2', gender: 'M', firstname: 'Hamim', lastname: 'Ahmed', birthdate: new Date(1952, 1, 2), mobileNumber: '0667777777', email: 'hamim.ahmed@mail.fr', address: {} },
    { id: '3', gender: 'F', firstname: 'Safia', lastname: 'Bouj', birthdate: new Date(1991, 1, 2), mobileNumber: '0688888888', email: 'safia.bouj@mail.fr', address: {} },
    { id: '4', gender: 'M', firstname: 'Salim', lastname: 'Hamir', birthdate: new Date(1984, 1, 2), mobileNumber: '0633333333', email: 'salim.hamir@mail.fr', address: {} }
  ];

  constructor() { }

  create(customer: Customer): Observable<Customer> {
    customer.id = new Date().getMilliseconds().toString();
    this.customers.unshift(customer);
    return of(customer);
  }
}
