import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormControl, Validators,  FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

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

  constructor(
    private fb: FormBuilder,
    private service: HajjService,
    public dialogRef: MatDialogRef<HajjDialogComponent>,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: this.fb.control(new Date().getFullYear(), Validators.required),
      price: this.fb.control(null, Validators.required),
    });
  }

  save() {
    this.loading = true;
    this.saveSubscription = this.service.createHajj({
      name: this.form.value.name,
      unitPrice: this.form.value.price,
      status: 'En cours'
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
