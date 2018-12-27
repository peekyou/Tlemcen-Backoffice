import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { AppDocument } from '../../../management/documents-management/document.model';
import { DocumentService } from '../../../management/documents-management/document.service';
import { Customer } from '../../../customers/customer.model';
import { Travel } from '../../../travels/travel.model';
import { Payment } from '../../../payments/payment.model';
import { TravelService } from '../../../travels/travel.service';
import { Fee } from '../../../management/fees-management/fee.model';
import { HotelReservation } from '../../../hotels/hotel-reservation.model';
import { FlightBooking } from '../../../airlines/flight-booking.model';

@Component({
  selector: 'app-customer-travel',
  templateUrl: './customer-travel.component.html',
  styleUrls: ['./customer-travel.component.scss']
})
export class CustomerTravelComponent implements OnInit {
  step = 0;
  customerIndex = 0;
  fees: Fee[] = [];
  hotelBookings: HotelReservation[] = [];
  flightBookings: FlightBooking[] = [];
  payment: Payment;
  documents: AppDocument[];
  loader: Subscription;

  @Input() customers: Customer[];
  @Input() travel: Travel;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private travelService: TravelService) { 
  }

  ngOnInit() {
    if (this.travel) {
      this.loader = this.documentService.getDocumentsByCategory(this.travel.travelTypeId)
        .subscribe(res => {
          this.documents = res;
          this.customers.forEach(c => c.documents = JSON.parse(JSON.stringify(this.documents)));
        });
    }
  }
  
  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  validate() {
    if (this.customers.length -1 > this.customerIndex) {
      this.customerIndex++;
      this.step = 0;
      window.scroll(0,0);
    }
    else {
      var additionalFeeIds = [];
      this.fees.forEach(f => {
        if (f.isServiceFee) {
          additionalFeeIds.push(f.id);
        }
      });

      this.travelService.addTravelers({
        customer: this.customers[this.customerIndex],
        travel: this.travel,
        flightBookings: this.flightBookings,
        hotelBookings: this.hotelBookings,
        payment: this.payment,
        additionalFeeIds: additionalFeeIds
      })
      .subscribe(res => {
        this.router.navigate(['../../'], { relativeTo: this.route });
      });
    }
  }

  onTravelServicesChange(feesAndBookings) {
    this.fees = feesAndBookings.fees;
    this.hotelBookings = feesAndBookings.hotelBookings;
    this.flightBookings = feesAndBookings.flightBookings;
  }
  
  onPaymentChange(payment) {
    this.payment = payment;
  }
}
