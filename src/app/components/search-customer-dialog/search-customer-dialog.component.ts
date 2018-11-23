import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

import { Customer } from '../../customers/customer.model';
import { CustomersService } from '../../customers/customers.service';
import { CustomerDialogComponent } from '../customer-dialog/customer-dialog.component';
import { removeFromArray } from '../../core/helpers/utils';

@Component({
  selector: 'app-search-customer-dialog',
  templateUrl: './search-customer-dialog.component.html',
  styleUrls: ['./search-customer-dialog.component.scss']
})
export class SearchCustomerDialogComponent implements OnInit {
  customers: Customer[];
  customersChecked: Customer[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private service: CustomersService) {

    this.customers = service.customers;
  }

  ngOnInit() {
  }

  customerChecked($event, customer: Customer) {
    if ($event.checked) {
      this.customersChecked.push(customer);
    }
    else {
      this.customersChecked = removeFromArray(this.customersChecked, customer);
    }
  }

  newCustomer() {
    let dialogRef = this.dialog.open(CustomerDialogComponent, {
        autoFocus: false,
        width: '534px'
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
        }
    });
  }
}
