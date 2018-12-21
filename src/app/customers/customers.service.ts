import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Customer } from './customer.model';
import { AuthHttpService } from '../core/services/auth-http.service';
import { PagingResponse } from '../core/models/paging';

@Injectable()
export class CustomersService {
  resource = 'customers';

  constructor(private http: AuthHttpService) { }

  getCustomers(): Observable<PagingResponse<Customer>> {
    return this.http.get(this.resource);
  }

  getCustomer(id): Observable<Customer> {
    return this.http.get(this.resource + '/' + id);
  }

  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post(this.resource, customer);
  }

  deleteCustomer(id: string) : Observable<boolean> {
    return this.http.delete(this.resource + '/' + id);
  }
}
