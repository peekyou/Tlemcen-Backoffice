import { Component, OnInit, Output, Input, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { HotelsService } from '../../../hotels/hotels.service';
import { HotelReservation } from '../../../hotels/hotel-reservation.model';
import { Customer } from '../../../customers/customer.model';
import { getAge } from '../../../core/helpers/utils';
import { TravelService } from '../../../travels/travel.service';
import { Fee } from '../../../management/fees-management/fee.model';

@Component({
  selector: 'app-hotel-booking-dialog',
  templateUrl: './hotel-booking-dialog.component.html',
  styleUrls: ['./hotel-booking-dialog.component.scss']
})
export class HotelBookingDialogComponent implements OnInit {
  canContinue = false;
  travelId: string;
  customers: Customer[] = [];
  nbAdults: number = 0;
  nbChildren: number = 0;
  nbInfants: number = 0;
  fees: Fee[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<HotelBookingDialogComponent>,
    private dialog: MatDialog,
    private service: HotelsService,
    private travelService: TravelService) {

      if (data) {
        this.travelId = data.travelId;
        this.customers = data.customers;
        this.customers.forEach(x => {
          var age = getAge(x.birthDate);
          if (age < 2) this.nbInfants++;
          else if (age < 13) this.nbChildren++;
          else this.nbAdults++;
        })
      }
  }

  ngOnInit() {
  }

  onHotelsChange(hotels) {
    this.customers = hotels.customers;
    this.fees = hotels.fees;
    for (var i = 0; i < hotels.customers.length; i++) {
      if (hotels.customers[i].hotelBookings.length > 0) {
        this.canContinue = true;
        break;
      }
    }
  }
  
  save() {
    // this.service.bookFlights(this.travelId, this.flightBookings)
    // .subscribe(res => {
    //   this.dialogRef.close(true);
    // });
    this.travelService.travelWithCustomers.customers = this.customers;
    this.dialogRef.close(true);
  }

  cancel() {
    this.travelService.travelWithCustomers = null;
    this.dialogRef.close(false);
  }
}
