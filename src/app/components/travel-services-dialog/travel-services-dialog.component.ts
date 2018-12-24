import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';

import { Fee } from '../../management/fees-management/fee.model';
import { FeeService } from '../../management/fees-management/fee.service';
import { Customer } from '../../customers/customer.model';
import { CustomersService } from '../../customers/customers.service';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component'

@Component({
  selector: 'app-travel-services-dialog',
  templateUrl: './travel-services-dialog.component.html',
  styleUrls: ['./travel-services-dialog.component.scss']
})
export class TravelServicesDialogComponent implements OnInit {
  customers: Customer[];
  loading: boolean;
  fees: Fee[];
  loader: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TravelServicesDialogComponent>,
    private dialog: MatDialog,
    private feeService: FeeService,
    private customerService: CustomersService) {
      
      if (data) {
        this.loader = this.feeService.getFeesByCategory(data.travel.travelTypeId)
          .subscribe(res => {
            this.fees = res;
            this.customers = data.customers;
            // this.customers.forEach(c => c.documents = JSON.parse(JSON.stringify(this.fees)));
          });
    } }

  ngOnInit() {
  }

}
