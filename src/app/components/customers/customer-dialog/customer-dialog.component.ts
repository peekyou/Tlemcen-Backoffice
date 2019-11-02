import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription, Observable } from 'rxjs';

import { CustomersService } from '../../../customers/customers.service';
import { Customer } from '../../../customers/customer.model';

@Component({
  selector: 'app-customer-dialog',
  templateUrl: './customer-dialog.component.html',
  styleUrls: ['./customer-dialog.component.scss']
})
export class CustomerDialogComponent implements OnInit {
  success = true;
  saveSubscription: Subscription;
  loader: Subscription;
  customer: Customer;
  
  constructor(
    public dialogRef: MatDialogRef<CustomerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private service: CustomersService) {

      if (data && data.customer) {
        this.loader = this.service.getCustomer(data.customer.id)
          .subscribe(res => this.customer = res);
      }
    }

  ngOnInit() {
  }

  onSubmit(customer) {
    this.saveSubscription = this.saveCustomer(customer)
      .subscribe(
          newCustomer => {
            this.close(newCustomer)
          },
          err => console.log(err)
      );
  }

  saveCustomer(customer): Observable<Customer> {
    return this.customer ? this.service.updateCustomer(customer) : this.service.createCustomer(customer);
  }

  close(customer = null): void {
      this.dialogRef.close(customer);
  }
}
