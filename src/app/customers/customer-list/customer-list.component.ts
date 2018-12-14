import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { DeleteDialogComponent } from '../../components/common/delete-dialog/delete-dialog.component';
import { Customer } from '../customer.model';
import { CustomersService } from '../customers.service';
import { CustomerDialogComponent } from '../../components/customers/customer-dialog/customer-dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  moment;
  customers: Customer[];

  constructor(private service: CustomersService, private dialog: MatDialog) { 
    this.customers = service.customers;
    this.moment = moment;
  }

  ngOnInit() {
  }

  openCustomerDialog() {
    let dialogRef = this.dialog.open(CustomerDialogComponent, {
        autoFocus: false,
        width: '434px'
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
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
        this.service.delete(customer.id)
        .subscribe(
          res => this.customers = this.service.customers,
          err => console.log(err)
        );
      }
    });
  }
}
