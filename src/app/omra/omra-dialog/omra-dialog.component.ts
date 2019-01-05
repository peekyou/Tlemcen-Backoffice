import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormControl, Validators,  FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { OmraService } from '../omra.service';
import { validateDate } from '../../core/helpers/utils';

@Component({
  selector: 'app-omra-dialog',
  templateUrl: './omra-dialog.component.html',
  styleUrls: ['./omra-dialog.component.scss']
})
export class OmraDialogComponent implements OnInit {
  loading: boolean;
  form: FormGroup;
  saveSubscription: Subscription;
  validateDate: Function;

  constructor(
    private fb: FormBuilder,
    private service: OmraService,
    public dialogRef: MatDialogRef<OmraDialogComponent>,
    private dialog: MatDialog) { 
      this.validateDate = validateDate;
    }

  ngOnInit() {
    this.form = this.fb.group({
      name: this.fb.control(null, Validators.required),
      startDate: this.fb.control(null, Validators.required),
      endDate: this.fb.control(null, Validators.required),
      price: this.fb.control(null, Validators.required),
    });
  }

  save() {
    this.loading = true;
    this.saveSubscription = this.service.createOmra({
      name: this.form.value.name,
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
