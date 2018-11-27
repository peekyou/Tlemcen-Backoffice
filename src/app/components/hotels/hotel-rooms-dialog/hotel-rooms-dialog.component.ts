import { Component, OnInit, Output, EventEmitter, Input, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subscription, Observable } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';

import { Hotel } from '../../../hotels/hotel.model';
import { HotelsService } from '../../../hotels/hotels.service';

@Component({
  selector: 'app-hotel-rooms-dialog',
  templateUrl: './hotel-rooms-dialog.component.html',
  styleUrls: ['./hotel-rooms-dialog.component.scss']
})
export class HotelRoomsDialogComponent implements OnInit {
    form: FormGroup;
    loader: Subscription;
    loading = false;
    hotel: Hotel = new Hotel();

    constructor(
      private service: HotelsService,
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<HotelRoomsDialogComponent>,
      private dialog: MatDialog) {
    }

    ngOnInit() {
      this.form = this.fb.group({
          roomsCount: this.fb.control(this.hotel.roomsCount),
          roomsPersonCount: this.fb.array([]),
      });

      this.roomsCount.valueChanges.forEach(
        (value: string) => {
          var rooms = <FormArray>this.form.controls['roomsPersonCount'];
          this.clearFormArray(rooms);
          this.addArrayControl(rooms, this.roomsCount.value)
      });
    }

    cancel() {
      this.dialogRef.close();
    }

    saveHotel() {
      this.loading = true;
      var hotel = new Hotel();
      hotel.name = this.form.value.name;
      hotel.roomsCount = this.form.value.roomsCount;
      hotel.email = this.form.value.email;
      hotel.phone = this.form.value.phone;
      
      this.loader = this.service
          .create(hotel)
          .subscribe(
              res => {
                  this.loading = false;
              },
              err => this.loading = false
          );
    }

    private addArrayControl(arrayControl: FormArray, count: number) {
      for (let i = 0; i < count; i++) {
        arrayControl.push(new FormControl());
      }
    }

    private clearFormArray(formArray: FormArray) {
      while (formArray.length !== 0) {
          formArray.removeAt(0)
      }
  }

    private customEmailValidator(control: AbstractControl): ValidationErrors {
      if (!control.value) {
          return null;
      }
      return Validators.email(control);
    }

    get roomsCount() { return this.form.get('roomsCount'); }
}
