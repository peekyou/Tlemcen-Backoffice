import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormControl, Validators,  FormGroup, FormArray } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import * as moment from 'moment';

import { OmraService } from '../omra.service';
import { Omra } from '../omra.model';
import { TravelGuide } from '../../travels/travel.model';
import { validateDate, dateToMoment, dateToUTC } from '../../core/helpers/utils';

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
  omra: Omra = new Omra();
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private service: OmraService,
    public dialogRef: MatDialogRef<OmraDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog) {

      this.validateDate = validateDate;
      if (data && data.omra) {
        this.omra = data.omra;
        this.isEdit = true;
      }
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: this.fb.control(this.omra.name, Validators.required),
      startDate: this.fb.control(dateToMoment(this.omra.startDate), Validators.required),
      endDate: this.fb.control(dateToMoment(this.omra.endDate), Validators.required),
      price: this.fb.control(this.omra.unitPrice, Validators.required),
      travelGuides: this.fb.array([])
    });

    if (!this.omra.travelGuides || this.omra.travelGuides.length == 0) {
      this.addGuideControl();
    }
    else {
      this.omra.travelGuides.forEach(x => this.addGuideControl(x));
    }
  }

  save() {
    this.loading = true;
    var name: string = this.form.value.name;
    if (name.toLowerCase().indexOf('omra') === -1) {
      name = 'Omra ' + name;
    }

    this.omra.name = name;
    this.omra.startDate = dateToUTC(this.form.value.startDate);
    this.omra.endDate = dateToUTC(this.form.value.endDate);
    this.omra.unitPrice = this.form.value.price;
    this.omra.travelGuides = this.form.value.travelGuides;

    this.saveSubscription = this.saveOmra()
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

  private saveOmra() : Observable<Omra> {
    return this.isEdit ? this.service.updateOmra(this.omra) : this.service.createOmra(this.omra);
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
