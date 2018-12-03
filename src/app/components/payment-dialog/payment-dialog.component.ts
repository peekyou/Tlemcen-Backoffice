import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Customer } from '../../customers/customer.model';
import { Payment } from '../../payments/payment.model';
import { PaymentService } from '../../payments/payment.service';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.scss']
})
export class PaymentDialogComponent implements OnInit {
  loading: boolean;
  customers: Customer[];
  form: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,    
    public dialogRef: MatDialogRef<PaymentDialogComponent>,
    private dialog: MatDialog,
    private paymentService: PaymentService) {

      this.customers = data.customers;
  }

  ngOnInit() {
    var amountControls: FormArray = this.fb.array([]);
    for (let i = 0; this.customers && i < this.customers.length; i++) {
      amountControls.push(new FormControl(null, Validators.required));
	  }
		
    this.form = this.fb.group({
      amounts: amountControls
    });
  }

  pay() {
    var payments: Payment[] = [];
    var amounts = <FormArray>this.form.controls['amounts'];
    
    amounts.controls.forEach((control, i) => {
      payments.push({
        amount: control.value,
        customer: this.customers[i],
        date: new Date(),
        status: 'P'
      });
    });

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
}
