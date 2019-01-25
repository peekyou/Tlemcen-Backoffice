import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';

import { Customer } from '../../../customers/customer.model';
import { CustomersService } from '../../../customers/customers.service';
import { CustomerDialogComponent } from '../customer-dialog/customer-dialog.component';
import { removeFromArray } from '../../../core/helpers/utils';
import { PagingResponse } from '../../../core/models/paging';

@Component({
  selector: 'app-search-customer-dialog',
  templateUrl: './search-customer-dialog.component.html',
  styleUrls: ['./search-customer-dialog.component.scss']
})
export class SearchCustomerDialogComponent implements OnInit {
  loader: Subscription;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  customers: PagingResponse<Customer>;
  customersChecked: Customer[] = [];
  searchTerm: string = '';
  // @Output() onCustomersAdded: EventEmitter<Customer[]> = new EventEmitter();
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<SearchCustomerDialogComponent>,
    private service: CustomersService) {
      this.getCustomers();
  }

  ngOnInit() {
  }

  getCustomers() {
    this.loader = this.service.getCustomers(this.currentPage, this.itemsPerPage, this.searchTerm)
    .subscribe(
      res => this.customers = res
    );
  }

  pageChanged(page) {
    this.currentPage = page;
    this.getCustomers();
  }

  searchCustomers() {
    this.currentPage = 1;
    this.getCustomers();
  }

  onCustomerChecked($event, customer: Customer) {
    if ($event.checked) {
      this.customersChecked.push(customer);
    }
    else {
      this.customersChecked = removeFromArray(this.customersChecked, customer);
    }
  }

  isCustomerChecked(customer: Customer) {
    return this.customersChecked.find(x => x.id == customer.id) != null;
  }

  newCustomer() {
    let dialogRef = this.dialog.open(CustomerDialogComponent, {
        autoFocus: false,
        width: '534px'
    });

    dialogRef.afterClosed().subscribe(customer => {
      if (customer) {
        this.customers.data.unshift(customer);
        this.customers.paging.totalCount++;
        // this.onCustomersAdded.emit(customers);
        // this.close(customer);
      }
    });
  }

  addExisting(customer = null) {
    var selected: Customer[] = customer ? [customer] : this.customersChecked;
    this.close(selected);
  }

  close(customers: Customer[]): void {
    this.dialogRef.close(customers);
  }
}
