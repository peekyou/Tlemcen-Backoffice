import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';

import { CustomersService } from '../../../customers/customers.service';

@Component({
  selector: 'app-customer-dialog',
  templateUrl: './customer-dialog.component.html',
  styleUrls: ['./customer-dialog.component.scss']
})
export class CustomerDialogComponent implements OnInit {
  success = true;
  saveSubscription: Subscription;    
  @Input() showDocuments = false;
  
  constructor(
    public dialogRef: MatDialogRef<CustomerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private service: CustomersService) { }

  ngOnInit() {
  }

  onSubmit(customer) {
    this.saveSubscription = this.service
      .createCustomer(customer)
      .subscribe(
          res => {
              this.close(customer)
          },
          err => console.log(err)
      );
  }

  close(customer = null): void {
      this.dialogRef.close(customer);
  }
}
