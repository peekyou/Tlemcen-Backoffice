import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Customer } from '../../customers/customer.model';
import { Payment } from '../../payments/payment.model';
import { PaymentService } from '../../payments/payment.service';
import { Fee } from '../../management/fees-management/fee.model';
import { FeeService } from '../../management/fees-management/fee.service';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.scss']
})
export class PaymentDialogComponent implements OnInit {
  loading: boolean;
  customers: Customer[];
  fees: Fee[];
  form: FormGroup;
  totalAmount: number = 0;
  
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,    
    public dialogRef: MatDialogRef<PaymentDialogComponent>,
    private dialog: MatDialog,
    private paymentService: PaymentService,
    private feeService: FeeService) {

      this.customers = data.customers;
      this.fees = this.feeService.fees.filter(x => x.categories.indexOf('Hajj') != -1 || x.categories.indexOf('Omra') != -1);
      this.totalAmount = this.fees.reduce(function(a, b){
        return a + b.amount;
      }, 0);
  }

  ngOnInit() {
    var paymentControls: FormArray = this.fb.array([]);
    for (let i = 0; this.customers && i < this.customers.length; i++) {
      // paymentControls.push(new FormControl(null, Validators.required));
      paymentControls.push(this.fb.group({
        amount: [null, Validators.required],
        discount: [null]
      }));
	  }
		
    this.form = this.fb.group({
      payments: paymentControls
    });
  }

  pay() {
    var payments: Payment[] = [];
    var amounts = <FormArray>this.form.controls['payments'];

    amounts.controls.forEach((control, i) => {
      payments.push({
        amountPaid: control.value.amount,
        discount: control.value.discount,
        customer: this.customers[i],
        fees: this.totalAmount,
        date: new Date(),
        status: (control.value.amount + control.value.discount) == this.totalAmount ? 'P' : 'I'
      });
    });
    console.log(amounts)

    this.paymentService.createMultiple(payments)
      .subscribe(
        res => {},
        err => console.log(err)
      );

    this.dialogRef.close(this.customers);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  getAmountToPay(amount: number, controlIndex: number) {
    var controls = <FormArray>this.form.controls['payments'];
    var discount = controls.at(controlIndex).get('discount');
    if (!discount) {
      return amount;
    }
    return Math.max(0, amount - discount.value);
  }
}
