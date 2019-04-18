import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { DeleteDialogComponent } from '../../components/common/delete-dialog/delete-dialog.component';
import { Customer } from '../customer.model';
import { CustomersService } from '../customers.service';
import { CustomerDialogComponent } from '../../components/customers/customer-dialog/customer-dialog.component';
import { PagingResponse } from '../../core/models/paging';
import { TravelType } from '../../travels/travel.model';

import * as moment from 'moment';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  moment;
  loader: Subscription;
  currentPage: number = 1;
  itemsPerPage: number = 20;
  customers: PagingResponse<Customer>;
  searchTerm: string;

  constructor(private service: CustomersService, private dialog: MatDialog) { 
    this.moment = moment;
    this.getCustomers();
  }

  ngOnInit() {
  }

  getCustomers(resetPagination = false) {
    window.scroll(0,0);
    this.currentPage = resetPagination ? 1 : this.currentPage;
    this.loader = this.service.getCustomers(this.currentPage, this.itemsPerPage, this.searchTerm)
    .subscribe(
      res => this.customers = res,
      err => console.log(err)
    );
}

  pageChanged(page) {
    this.currentPage = page;
    this.getCustomers();
  }

  openCustomerDialog() {
    let dialogRef = this.dialog.open(CustomerDialogComponent, {
        autoFocus: false,
        width: '634px'
    });

    dialogRef.afterClosed().subscribe(customer => {
        if (customer) {
          this.currentPage = 1;
          this.getCustomers();
        }
    });
  }

  openDeleteDialog(customer: Customer) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      autoFocus: false,
      data: { name: customer.firstname + " " + customer.lastname }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.service.deleteCustomer(customer.id)
        .subscribe(
          res => {
            var index = this.customers.data.indexOf(customer);
            if (index > -1) {
                this.customers.data.splice(index, 1);
                this.customers.paging.totalCount--;
            }
          },
          err => console.log(err)
        );
      }
    });
  }
}
