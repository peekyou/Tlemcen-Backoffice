import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormControl, Validators,  FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { validateDate } from '../../core/helpers/utils';

import { HajjService } from '../hajj.service';

@Component({
  selector: 'app-hajj-dialog',
  templateUrl: './hajj-dialog.component.html',
  styleUrls: ['./hajj-dialog.component.scss']
})
export class HajjDialogComponent implements OnInit {
  loading: boolean;
  form: FormGroup;
  saveSubscription: Subscription;
  validateDate: Function;

  constructor(
    private fb: FormBuilder,
    private service: HajjService,
    public dialogRef: MatDialogRef<HajjDialogComponent>,
    private dialog: MatDialog) { 
      this.validateDate = validateDate;
    }

  ngOnInit() {
    this.form = this.fb.group({
      startDate: this.fb.control(null, Validators.required),
      endDate: this.fb.control(null, Validators.required),
      price: this.fb.control(null, Validators.required),
    });
  }

  save() {
    this.loading = true;
    this.saveSubscription = this.service.createHajj({
      name: 'Hajj ' + this.form.value.startDate.year(),
      startDate: this.form.value.startDate,
      endDate: this.form.value.endDate,
      unitPrice: this.form.value.price,
      status: new Date() > this.form.value.endDate ? 'Terminé' : new Date() < this.form.value.startDate ? 'A venir' : 'En cours'
    })
    .subscribe(
      res => {
        this.loading = false;
        this.dialogRef.close(res);
      },
      err => {
        this.loading = false;
        console.log(err);
      });
  }

  cancel() {
    this.dialogRef.close();
  }
}
