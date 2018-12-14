import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators,  FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription, Observable } from 'rxjs';

import { Fee } from '../fee.model';
import { FeeService } from '../fee.service';

@Component({
  selector: 'app-service-fee-dialog',
  templateUrl: './service-fee-dialog.component.html',
  styleUrls: ['./service-fee-dialog.component.scss']
})
export class ServiceFeeDialogComponent implements OnInit {
  form: FormGroup;
  fee: Fee = new Fee();
  saveSubscription: Subscription;

  constructor(
    private service: FeeService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ServiceFeeDialogComponent>,
    private dialog: MatDialog) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      type: this.fb.control(this.fee.categories ? this.fee.categories : 'HAJJOMRA', Validators.required),
      name: this.fb.control(this.fee.name, Validators.required),
      amount: this.fb.control(this.fee.amount, Validators.required)
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  saveFee() {
    var fee = new Fee();
    fee.name = this.form.value.name;
    fee.amount = this.form.value.amount;
    if (this.form.value.type == 'HAJJOMRA') {
      fee.categories = ['Hajj', 'Omra'];
    }
    else if (this.form.value.type == 'HOTEL') {
      fee.categories = ['Hôtel'];
    }
    else if (this.form.value.type == 'FLIGHT') {
      fee.categories = ['Vol'];
    }
    
    this.saveSubscription = this.service
        .createServiceFee(fee)
        .subscribe(
            res => {
                this.dialogRef.close(res);
            },
            err => console.log(err)
        );
  }
}
