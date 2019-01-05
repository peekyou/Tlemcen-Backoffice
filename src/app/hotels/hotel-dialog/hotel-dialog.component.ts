import { Component, OnInit, Output, EventEmitter, Input, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription, Observable } from 'rxjs';

import { Hotel } from '../hotel.model';
import { HotelsService } from '../hotels.service';

@Component({
  selector: 'app-hotel-dialog',
  templateUrl: './hotel-dialog.component.html',
  styleUrls: ['./hotel-dialog.component.scss']
})
export class HotelDialogComponent implements OnInit {
    form: FormGroup;
    loader: Subscription;
    loading = false;
    hotel: Hotel = new Hotel();
    isEdit = false;

    constructor(
      private service: HotelsService,
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<HotelDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private dialog: MatDialog) {
          if (data && data.hotel) {
            this.hotel = data.hotel;
            this.isEdit = true;
          }
    }

    ngOnInit() {
        this.form = this.fb.group({
            name: this.fb.control(this.hotel.name, Validators.required),
            category: this.fb.control(this.hotel.category || ''),
            phone: this.fb.control(this.hotel.contactPhoneNumber),
            email: this.fb.control(this.hotel.contactEmail, (c) => this.customEmailValidator(c)),
            roomsCount: this.fb.control(this.hotel.roomsCount)
        });
    }

    cancel() {
      this.dialogRef.close();
    }

    saveHotel() {
      this.loading = true;
      this.hotel.name = this.form.value.name;
      this.hotel.category = this.form.value.category;
      this.hotel.roomsCount = this.form.value.roomsCount;
      this.hotel.contactEmail = this.form.value.email;
      this.hotel.contactPhoneNumber = this.form.value.phone;
      
      this.loader = this.save()
          .subscribe(
              res => {
                  this.loading = false;
                  this.dialogRef.close(res);
              },
              err => this.loading = false
          );
    }

    private save() : Observable<Hotel> {
        return this.isEdit ? this.service.updateHotel(this.hotel) : this.service.createHotel(this.hotel);
    }

    private customEmailValidator(control: AbstractControl): ValidationErrors {
      if (!control.value) {
          return null;
      }
      return Validators.email(control);
    }

    get email() { return this.form.get('email'); }
}
