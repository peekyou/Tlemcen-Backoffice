import { Component, OnInit, Output, Input, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AirlinesService } from '../../../airlines/airlines.service';
import { FlightBooking } from '../../../airlines/flight-booking.model';

@Component({
  selector: 'app-flight-booking-dialog',
  templateUrl: './flight-booking-dialog.component.html',
  styleUrls: ['./flight-booking-dialog.component.scss']
})
export class FlightBookingDialogComponent implements OnInit {
  flightBookings: FlightBooking[];
  travelId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FlightBookingDialogComponent>,
    private dialog: MatDialog,
    private service: AirlinesService) { 
      if (data) {
        this.travelId = data.travelId;
      }
    }

  ngOnInit() {
  }

  onFlightsChange(flights) {
    this.flightBookings = flights.flightBookings;
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    this.service.bookFlights(this.travelId, this.flightBookings)
    .subscribe(res => {
      this.dialogRef.close(true);
    });
  }
}
