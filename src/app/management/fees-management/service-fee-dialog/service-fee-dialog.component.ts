import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators,  FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription, Observable } from 'rxjs';

import { Fee } from '../fee.model';
import { FeeService } from '../fee.service';
import { Category } from '../../../core/models/category.model';

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
      hajj: this.fb.control(this.fee.categories.indexOf(Category.Hajj) > -1),
      omra: this.fb.control(this.fee.categories.indexOf(Category.Omra) > -1),
      travel: this.fb.control(this.fee.categories.indexOf(Category.Travel) > -1),
      hotel: this.fb.control(this.fee.categories.indexOf(Category.Hotel) > -1),
      flight: this.fb.control(this.fee.categories.indexOf(Category.Flight) > -1),
      name: this.fb.control(this.fee.name, Validators.required),
      price: this.fb.control(this.fee.price)
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  saveFee() {
    var fee = new Fee();
    fee.name = this.form.value.name;
    fee.price = this.form.value.price;
    if (this.form.value.hajj == true) {
      fee.categories.push(Category.Hajj);
    }
    if (this.form.value.omra == true) {
      fee.categories.push(Category.Omra);
    }
    if (this.form.value.travel == true) {
      fee.categories.push(Category.Travel);
    }
    if (this.form.value.hotel == true) {
      fee.categories.push(Category.Hotel);
    }
    if (this.form.value.flight == true) {
      fee.categories.push(Category.Flight);
    }

    this.saveSubscription = this.service
        .createFee(fee)
        .subscribe(
            res => {
                this.dialogRef.close(res);
            },
            err => console.log(err)
        );
  }
}
