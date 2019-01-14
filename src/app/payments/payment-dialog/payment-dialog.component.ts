import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subscription } from 'rxjs';

import { TravelService } from '../../travels/travel.service';
import { CustomerTravel } from '../../customers/customer-travel.model';
import { Payment } from '../payment.model';
import { Fee } from '../../management/fees-management/fee.model';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.scss']
})
export class PaymentDialogComponent implements OnInit {
  loader: Subscription;
  customerTravel: CustomerTravel;
  payment: Payment;
  fees: Fee[] = [];

  constructor(
    private service: TravelService,
    public dialogRef: MatDialogRef<PaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog) {

      if (data && data.payment) {
        this.payment = data.payment;
        this.loader = service.getTraveler(data.payment.travelId, data.payment.customer.id)
          .subscribe(res => {
            this.customerTravel = res;
            this.buildFees();
          });
      }
    }

  ngOnInit() {
  }

  buildFees() {
    if (this.customerTravel && this.customerTravel.customer) {
      if (this.customerTravel.customer.additionalFees) {
        this.fees = this.customerTravel.customer.additionalFees;
      }

      if (this.customerTravel.customer.hotelBookings) {
        this.customerTravel.customer.hotelBookings.forEach(booking => {
            booking.rooms.forEach(room => {
              if (room.isSeparateBooking) {
                this.fees.push({
                  name: booking.hotel.name + ' ' + room.roomType.name,
                  price: room.price
                });
              }
            });
        });
      }

      if (this.customerTravel.customer.flightBookings) {
        this.customerTravel.customer.flightBookings.forEach(booking => {
          if (booking.isSeparateBooking) {
            this.fees.push({ 
              name: booking.flight.airline.name,
              price: booking.price
            });
          }
        });
      }
    }
  }

  close() {
    this.dialogRef.close();
  }
}
