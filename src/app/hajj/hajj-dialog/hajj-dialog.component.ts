import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import * as moment from 'moment';

import { validateDate, dateToMoment, dateToUTC } from '../../core/helpers/utils';
import { HajjService } from '../hajj.service';
import { Hajj } from '../hajj.model';
import { TravelGuide } from '../../travels/travel.model';

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
      name: this.fb.control(this.hajj.name, Validators.required),
      startDate: this.fb.control(dateToMoment(this.hajj.startDate), Validators.required),
      endDate: this.fb.control(dateToMoment(this.hajj.endDate), Validators.required),
      price: this.fb.control(this.hajj.unitPrice, Validators.required),
      travelGuides: this.fb.array([])
    });
    
    if (!this.hajj.travelGuides || this.hajj.travelGuides.length == 0) {
      this.addGuideControl();
    }
    else {
      this.hajj.travelGuides.forEach(x => this.addGuideControl(x));
    }
  }

  save() {
    this.loading = true;
    var name: string = this.form.value.name;
    if (name.toLowerCase().indexOf('hajj') === -1) {
      name = 'Hajj ' + name;
    }
    this.hajj.name = name;
    this.hajj.startDate = dateToUTC(this.form.value.startDate);
    this.hajj.endDate = dateToUTC(this.form.value.endDate);
    this.hajj.unitPrice = this.form.value.price;

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

  addGuideControl(guide: TravelGuide = null) {
    this.travelGuides.push(this.fb.group({
      id: this.fb.control(guide ? guide.id : null),
      firstname: this.fb.control(guide ? guide.firstname : null),
      lastname: this.fb.control(guide ? guide.lastname : null),
      mobileNumber: this.fb.control(guide ? guide.mobileNumber : null)
    }));
  }

  removeGuideControl(index: number) {
      this.travelGuides.removeAt(index);
  }

  get travelGuides(): FormArray { return <FormArray>this.form.get('travelGuides'); }
}
