import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Customer } from './customer.model';
import { AuthHttpService } from '../core/services/auth-http.service';
import { PagingResponse } from '../core/models/paging';
import { AppFile } from '../core/models/file.model';

@Injectable()
export class CustomersService {
  resource = 'customers';

  constructor(private http: AuthHttpService) { }

  getCustomers(page: number = null, count: number = null, searchTerm: string = ''): Observable<PagingResponse<Customer>> {
    return this.http.get(this.resource + '?pageNumber=' + page + '&itemsCount=' + count+ '&searchTerm=' + searchTerm);
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

  uploadCustomerDocument(customerId: string, documentTypeId: string, file: AppFile): Observable<Customer> {
    file.data = file.src;
    return this.http.post(this.resource + '/document?customerId=' + customerId + '&documentTypeId=' + documentTypeId, file);
  }
  
  getCustomerDocument(customerId: string, documentTypeId: string): Observable<any> {
    return this.http.getFile(this.resource + '/' + customerId + '/document/' + documentTypeId);
  }

  // getCustomerDocument(customerId: string, documentTypeId: string): string {
  //   return this.http.apiHost + this.resource + '/' + customerId + '/document/' + documentTypeId;
  // }
}
