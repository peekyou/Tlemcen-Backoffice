import { Component, OnInit, Output, Input, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription, Observable } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';

import { Hotel, RoomType } from '../../../hotels/hotel.model';
import { HotelReservation } from '../../../hotels/hotel-reservation.model';
import { HotelRoomReservation } from '../../../hotels/hotel-room-reservation.model';
import { HotelsService } from '../../../hotels/hotels.service';
import { validateDate } from '../../../core/helpers/utils';

@Component({
  selector: 'app-hotel-rooms-dialog',
  templateUrl: './hotel-rooms-dialog.component.html',
  styleUrls: ['./hotel-rooms-dialog.component.scss']
})
export class HotelRoomsDialogComponent implements OnInit {
  form: FormGroup;
  loader: Subscription;
  loading = false;
  hotelBooking: HotelReservation;
  hotels: Hotel[];
  roomTypes: RoomType[];
  travelId: string;
  validateDate: Function;

  constructor(
    private service: HotelsService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<HotelRoomsDialogComponent>,
    private dialog: MatDialog) {
      this.validateDate = validateDate;
      if (data) {
        this.hotelBooking = data.hotelReservation;
        this.travelId = data.travelId;
      }
      service.getHotels(null, null).subscribe(res => this.hotels = res.data);
  }

  ngOnInit() {
    var roomsControl = this.fb.array([]); 
    this.form = this.fb.group({
      hotel: this.fb.control(null, (c) => this.customHotelValidator(c)),
      fromDate: this.fb.control(null, Validators.required),
      toDate: this.fb.control(null, Validators.required),
      rooms: roomsControl,
    });

    this.service.getRoomTypes(null, null).subscribe(res => {
      this.roomTypes = res;
      this.roomTypes.forEach(roomType => {
        this.addRoomTypeControl(roomsControl, roomType)
      });
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    this.loading = true;
    var reservation = new HotelReservation();
    if (this.hotelBooking) {
      reservation.hotel = this.hotelBooking.hotel;
      reservation.id = this.hotelBooking.id;
    }
    else {
      reservation.hotel = this.form.value.hotel;
    }

    this.rooms.controls.forEach((control, i) => {
      var roomCount: number = control.value.roomCount;
      for (var i = 0; i < roomCount; i++) {
        reservation.rooms.push({
          fromDate: this.form.value.fromDate,
          toDate: this.form.value.toDate,
          roomType: {
            id: control.value.roomType.id
          },
          price: control.value.roomPrice,
          customers: []
        });    
      }
    });

    this.loader = this.service
      .saveHotelBooking(this.travelId, reservation)
      .subscribe(
          res => {
              this.loading = false;
              this.dialogRef.close(res);
          },
          err => this.loading = false
      );
  }

  private addRoomTypeControl(arrayControl: FormArray, roomType: RoomType) {
      arrayControl.push(this.fb.group({
        roomType: this.fb.control(roomType),
        roomCount: this.fb.control(0),
        roomPrice: this.fb.control(null)
      }));
  }

  private customHotelValidator(control: AbstractControl): ValidationErrors {
    if (!this.hotelBooking) {
      return Validators.required(control);
    }
    return null;
  }

  get hotel() { return this.form.get('hotel'); }
  get rooms(): FormArray { return <FormArray>this.form.get('rooms'); }
}
