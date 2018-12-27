import { Component, OnInit, Output, Input, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription, Observable } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';

import { Hotel } from '../../../hotels/hotel.model';
import { HotelReservation } from '../../../hotels/hotel-reservation.model';
import { HotelRoomReservation } from '../../../hotels/hotel-room-reservation.model';
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
  hotelReservation: HotelReservation;
  hotels: Hotel[];

  constructor(
    private service: HotelsService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<HotelRoomsDialogComponent>,
    private dialog: MatDialog) {
      if (data) {
        this.hotelReservation = data.hotelReservation;
      }
      service.getHotels(null, null).subscribe(res => this.hotels = res.data);
  }

  ngOnInit() {
    this.form = this.fb.group({
      hotel: this.fb.control(null, (c) => this.customHotelValidator(c)),
      roomsCount: this.fb.control(null, Validators.required),
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

  save() {
    this.loading = true;
    var rooms = <FormArray>this.form.controls['roomsPersonCount'];
    // var roomsReservation: HotelRoomReservation[] = [];
    var reservation = this.hotelReservation;
    if (!reservation) {
      reservation = new HotelReservation();
      reservation.hotel = this.form.value.hotel;
    }

    rooms.controls.forEach((control, i) => {
      // Call service to get id
      reservation.rooms.push({
        hotel: reservation.hotel,
        id: new Date().getMilliseconds().toString(),
        roomType: {
          id: new Date().getMilliseconds().toString(),
          number: (i + 1).toString(),
          personNumber: control.value
        },
        customers: []
      });
    });

    this.loader = this.service
      .saveHotelBooking(reservation)
      .subscribe(
          res => {
              this.loading = false;
              this.dialogRef.close(res);
          },
          err => this.loading = false
      );
  }

  private addArrayControl(arrayControl: FormArray, count: number) {
    for (let i = 0; i < count; i++) {
      arrayControl.push(new FormControl(4));
    }
  }

  private clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  private customHotelValidator(control: AbstractControl): ValidationErrors {
    if (!this.hotelReservation) {
      return Validators.required(control);
    }
    return null;
  }

  get roomsCount() { return this.form.get('roomsCount'); }
  get roomsPersonCount(): FormArray { return <FormArray>this.form.get('roomsPersonCount'); }
}
