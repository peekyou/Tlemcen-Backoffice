import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormControl, Validators,  FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { OmraService } from '../omra.service';

@Component({
  selector: 'app-omra-dialog',
  templateUrl: './omra-dialog.component.html',
  styleUrls: ['./omra-dialog.component.scss']
})
export class OmraDialogComponent implements OnInit {
  loading: boolean;
  form: FormGroup;
  saveSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private service: OmraService,
    public dialogRef: MatDialogRef<OmraDialogComponent>,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: this.fb.control(null, Validators.required),
    });
  }

  save() {
    this.loading = true;
    this.saveSubscription = this.service.createOmra({
      name: this.form.value.name,
      customers: [],
      flightBookings: [],
      hotelsBooking: [],
      revenues: 0,
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
