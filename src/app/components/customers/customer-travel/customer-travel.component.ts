import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

import { PrintDocumentsDialogComponent } from '../../travels/print-documents-dialog/print-documents-dialog.component';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';
import { AppDocument } from '../../../management/documents-management/document.model';
import { DocumentService } from '../../../management/documents-management/document.service';
import { CustomerDetail } from '../../../customers/customer-detail.model';
import { Travel } from '../../../travels/travel.model';
import { Payment } from '../../../payments/payment.model';
import { TravelService } from '../../../travels/travel.service';
import { Fee } from '../../../management/fees-management/fee.model';
import { HotelReservation } from '../../../hotels/hotel-reservation.model';
import { FlightBooking } from '../../../airlines/flight-booking.model';
import { CustomerTravel } from '../../../customers/customer-travel.model';
import { Lookup } from '../../../core/models/lookup.model';
import { LookupService } from '../../../core/services/lookup.service';
import { guid } from '../../../core/helpers/utils';

@Component({
  selector: 'app-customer-travel',
  templateUrl: './customer-travel.component.html',
  styleUrls: ['./customer-travel.component.scss']
})
export class CustomerTravelComponent implements OnInit {
  step = 0;
  customerIndex = 0;
  fees: Fee[] = [];
  relationships: Lookup[] = [];
  selectedRelationship: Lookup;
  loading = false;
  groupId: string = null;

  @Input() customers: CustomerDetail[];
  @Input() travel: Travel;
  @Input() isGroup: boolean = false;
  @Input() isEdit: boolean = false;

  // For edit mode
  @Input() customerTravel: CustomerTravel = new CustomerTravel();

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private lookupService: LookupService,
    // private documentService: DocumentService,
    private travelService: TravelService) { 

  }

  ngOnInit() {
    // Relationship only for a group
    if (!this.isGroup) {
      this.step = 1;
    }
    else {
      this.groupId = guid();
    }

    this.lookupService.fetchRelationships('fr').subscribe(res => {
      this.relationships = res;
      if (this.customerTravel && this.customerTravel.customer && this.customerTravel.customer.relationship) {
        this.selectedRelationship = res.find(x => x.name == this.customerTravel.customer.relationship);
      }
    });

    // if (this.travel) {
    //   this.loader = this.documentService.getDocumentsByCategory(this.travel.travelTypeId)
    //     .subscribe(res => {
    //       this.documents = res;
    //       this.customers.forEach(c => c.documents = JSON.parse(JSON.stringify(this.documents)));
    //     });
    // }
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
    this.loading = true;
    var additionalFee = [];
    this.fees.forEach(f => {
      if (f.isServiceFee) {
        additionalFee.push(f);
      }
    });

    var customer = this.customers[this.customerIndex];
    customer.additionalFees = additionalFee;
    if (this.selectedRelationship) {
      customer.relationship = this.selectedRelationship.name;
    }

    this.saveTraveler({
      customer: customer,
      travel: this.travel,
      groupId: this.groupId
    })
    .subscribe(
      res => {
        this.loading = false;
        this.openPrintDocumentsDialog();
      },
      err => this.loading = false);
  }

  saveTraveler(customerTravel: CustomerTravel): Observable<boolean> {
    return this.isEdit ? this.travelService.updateTraveler(customerTravel) : this.travelService.addTravelers(customerTravel);
  }

  openConfirmationDialog() {
    var customer = this.customers[this.customerIndex];
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        autoFocus: false,
        width: '534px',
        data: {
          text: "Valider l'inscription de " + customer.firstname + " " + customer.lastname + " dans " + this.travel.name + " ?"
        }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res === true) {
        this.validate();
      }
    });
  }

  openPrintDocumentsDialog() {
    var customerTravel = this.isEdit ? this.customerTravel : { travel: this.travel, customer: this.customers[this.customerIndex] };
    let dialogRef = this.dialog.open(PrintDocumentsDialogComponent, {
        autoFocus: false,
        width: '534px',
        data: {
          customerTravel: customerTravel
        }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.gotoNext();
    });
  }

  gotoNext() {
    if (this.customers.length -1 > this.customerIndex) {
      this.selectedRelationship = null;
      this.customerIndex++;
      this.step = 0;
      window.scroll(0,0);

      // Set the same hotels and flights by default if it's a group
      if (this.isGroup) {
        this.customers[this.customerIndex].hotelBookings = this.customers[this.customerIndex - 1].hotelBookings;
        this.customers[this.customerIndex].flightBookings = this.customers[this.customerIndex - 1].flightBookings;
      }
    }
    else {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  onTravelServicesChange(feesAndBookings) {
    var mainFees: Fee[] = this.fees.filter((x: Fee) => x.isMandatoryFee);
    this.fees = mainFees.concat(feesAndBookings.fees);
    this.customers[this.customerIndex].hotelBookings = feesAndBookings.hotelBookings;
    this.customers[this.customerIndex].flightBookings = feesAndBookings.flightBookings;
  }
  
  onPaymentChange(payment) {
    this.customers[this.customerIndex].payments = [payment];
  }
}
