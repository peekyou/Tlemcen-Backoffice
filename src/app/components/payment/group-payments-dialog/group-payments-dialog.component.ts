import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

import { CustomerDetail } from '../../../customers/customer-detail.model';
import { DeleteDialogComponent } from '../../../components/common/delete-dialog/delete-dialog.component';
import { Payment, PaymentType } from '../../../payments/payment.model';
import { Travel, TravelType } from '../../../travels/travel.model';
import { PaymentService } from '../../../payments/payment.service';
import { Fee } from '../../../management/fees-management/fee.model';
import { TravelService } from '../../../travels/travel.service';
import { dateToUTC } from '../../../core/helpers/utils';

@Component({
  templateUrl: './group-payments-dialog.component.html',
  styleUrls: ['./group-payments-dialog.component.scss']
})
export class GroupPaymentsDialogComponent implements OnInit {
  form: FormGroup;
  saving = false;
  loader: Subscription;
  paymentTypes: PaymentType[] = [];
  customers: CustomerDetail[] = [];
  travel: Travel;
  groupId: string;
  isDirty = false;

  constructor(
    public dialogRef: MatDialogRef<GroupPaymentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private travelService: TravelService) {

      this.customers = data.customers;
      this.travel = data.travel;
      this.groupId = data.groupId;
  }

  ngOnInit() {
    this.paymentService.getPaymentTypes().subscribe(res => this.paymentTypes = res);

    this.sumCustomersPayments();

    this.form = this.fb.group({
      amount: [null, Validators.required],
      discount: [null],
      paymentType: [null]
    });
  }

  sumCustomersPayments() {
    if (this.customers) {
      this.customers.forEach(c => {
        c.travelPayment = new Payment();
        c.payments.forEach(p => {
          // The latest payment is the current one
          c.travelPayment.amount = p.amount;
          c.travelPayment.discount += p.discount;
          c.travelPayment.amountPaid += p.amountPaid;
        });
      });
    }
  }

  private getPayment(): Payment {
    return {
      amountPaid: this.form.value.amount,
      discount: this.form.value.discount,
      createdDate: dateToUTC(moment()),
      paymentTypeId: this.form.value.paymentType
    };
  }

  calculateTotal() {
    var discount = this.form.controls['discount'].value;
    var currentDiscount = discount > 0 ? discount : 0;
    
    var total = 0;
    this.customers.forEach(c => {
      if (c.travelPayment) {
        total += c.travelPayment.amount;
        total -= c.travelPayment.discount;
      }
    });
    return total - currentDiscount;
  }

  calculateTotalPaid() {
    var total = 0;
    this.customers.forEach(c => {
      if (c.travelPayment) {
        total += c.travelPayment.amountPaid;
      }
    });
    return total;
  }

  saveGroupPayment(): void {
    this.saving = true;
    this.paymentService.createGroupPayment(this.groupId, this.getPayment())
    .subscribe(res => {
      this.isDirty = true;
      this.saving = false;
      this.updateAfterPayment();
    });
  }

  close(): void {
      this.dialogRef.close(this.isDirty ? this.customers : null);
  }

  updateAfterPayment() {
    this.loader = this.travelService.getGroupTravelers(this.travel.id, this.customers[0].id)
      .subscribe(res => {
        this.customers = res.customers;
        this.sumCustomersPayments();
        this.form.reset();
      });
  }

  calculateCustomerAmount(customer: CustomerDetail) {
    var currentDiscount = this.caculateCurrentDiscount(customer);
    return customer.travelPayment.amount - customer.travelPayment.discount - currentDiscount;
  }

  calculateRemainingAmount(customer: CustomerDetail) {
    var currentDiscount = this.caculateCurrentDiscount(customer);    
    return customer.travelPayment.amount - customer.travelPayment.discount - customer.travelPayment.amountPaid - currentDiscount;
  }

  private caculateCurrentDiscount(customer: CustomerDetail) {
    var currentDiscount = this.form.controls['discount'].value;
    if (currentDiscount > 0) {
      var customerRemaining = customer.travelPayment.amount - customer.travelPayment.discount - customer.travelPayment.amountPaid;
      var index = this.customers.indexOf(customer);
      for (var i = 0; i < index; i++) {
        var c = this.customers[i];
        var remanining = c.travelPayment.amount - c.travelPayment.discount - c.travelPayment.amountPaid;
        currentDiscount -= remanining;
      }
      return currentDiscount > customerRemaining ? customerRemaining : Math.max(0, currentDiscount);
    }
    return 0;
  }
}
