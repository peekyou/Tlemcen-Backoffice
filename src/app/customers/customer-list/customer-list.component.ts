import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Customer } from '../customer.model';
import { CustomersService } from '../customers.service';
import { CustomerDialogComponent } from '../../components/customer-dialog/customer-dialog.component';
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
}
