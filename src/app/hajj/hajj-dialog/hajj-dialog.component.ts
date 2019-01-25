import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormControl, Validators,  FormGroup } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { validateDate } from '../../core/helpers/utils';

import { HajjService } from '../hajj.service';
import { Hajj } from '../hajj.model';

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
  hajj: Hajj = new Hajj();
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private service: HajjService,
    public dialogRef: MatDialogRef<HajjDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog) {

      this.validateDate = validateDate;
      if (data && data.hajj) {
        this.hajj = data.hajj;
        this.isEdit = true;
      }
  }

  ngOnInit() {
    this.form = this.fb.group({
      startDate: this.fb.control(this.hajj.startDate, Validators.required),
      endDate: this.fb.control(this.hajj.endDate, Validators.required),
      price: this.fb.control(this.hajj.unitPrice, Validators.required),
    });
  }

  save() {
    this.loading = true;
    this.hajj.name = 'Hajj ' + this.form.value.startDate.year();
    this.hajj.startDate = this.form.value.startDate;
    this.hajj.endDate = this.form.value.endDate;
    this.hajj.unitPrice = this.form.value.price;
    this.hajj.status = new Date() > this.form.value.endDate ? 'Terminé' : new Date() < this.form.value.startDate ? 'A venir' : 'En cours';

    this.saveSubscription = this.saveHajj()
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

  private saveHajj() : Observable<Hajj> {
    return this.isEdit ? this.service.updateHajj(this.hajj) : this.service.createHajj(this.hajj);
  }

  cancel() {
    this.dialogRef.close();
  }
}
