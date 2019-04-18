import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

import { PrintDocumentsDialogComponent } from '../../travels/print-documents-dialog/print-documents-dialog.component';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';
import { CustomerDetail } from '../../../customers/customer-detail.model';
import { CustomerDialogComponent } from '../../customers/customer-dialog/customer-dialog.component';
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
  feesByCustomer = {};
  relationships: Lookup[] = [];
  selectedRelationship: Lookup;
  loading = false;
  groupId: string = null;
  canPay: boolean = true;
  travelersToSave: CustomerDetail[] = [];
  travelersSentToServer: CustomerTravel[] = [];

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
    private travelService: TravelService) { 

  }

  ngOnInit() {
    this.canPay = !this.isGroup;
    if (this.isGroup) {
      this.groupId = guid();
    }

    // In case of group build the fees from the private booking
    this.buildHotelFeesFromGroup();

    this.lookupService.fetchRelationships('fr').subscribe(res => {
      this.relationships = res;
      if (this.customerTravel && this.customerTravel.customer && this.customerTravel.customer.relationship) {
        this.selectedRelationship = res.find(x => x.name == this.customerTravel.customer.relationship);
      }
    });
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

  enablePayStep() {
    this.canPay = true;
    this.nextStep();
  }

  validate() {
    var additionalFee = [];
    this.fees.filter(x => !x.isPreviousFee).forEach(f => {
      if (f.isServiceFee) {
        additionalFee.push(f);
      }
    });

    var customer = this.customers[this.customerIndex];
    this.feesByCustomer[customer.id] = this.fees.map(x => ({ ...x })); // clone fees
    customer.additionalFees = additionalFee;
    if (this.selectedRelationship) {
      customer.relationship = this.selectedRelationship.name;
    }

    if (this.isGroup) {
      if (!customer.payments[0].payLater) {
        this.saveGroup();
      }
      else {
        this.travelersToSave.push(customer);
        this.gotoNext();
      }
    }
    else {
      this.loading = true;
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
  }

  saveTraveler(customerTravel: CustomerTravel): Observable<boolean> {
    return this.isEdit ? this.travelService.updateTraveler(customerTravel) : this.travelService.addTravelers([customerTravel]);
  }

  saveGroup() {
    this.loading = true;

    // In case of server error, it will not be recalculated
    if (this.travelersSentToServer.length == 0) {
      var currentCustomer = this.customers[this.customerIndex]; 
      var currentPayment = currentCustomer.payments[0];
      this.travelersToSave.forEach(customer => {

        // Transfer the amounts of the customer who paid to the customer who didn't pay
        var notPaidPayment = customer.payments[0];
        var amountToTransfer = notPaidPayment.amount - notPaidPayment.discount;
        var amountTransferable = Math.min(currentPayment.amountPaid,  amountToTransfer)
        currentPayment.amountPaid -= amountTransferable;
        customer.payments[0].amountPaid += amountTransferable;

        this.travelersSentToServer.push({
          customer: customer,
          travel: this.travel,
          groupId: this.groupId
        });
      });

      // Add the current customer
      this.travelersSentToServer.push({
        customer: currentCustomer,
        travel: this.travel,
        groupId: this.groupId
      });
    }

    this.travelService.addTravelers(this.travelersSentToServer)
    .subscribe(
      res => {
        this.loading = false;
        this.openPrintDocumentsDialog();
      },
      err => this.loading = false);
  }

  openConfirmationDialog() {
    var customer = this.customers[this.customerIndex];
    var text = "Valider l'inscription de " + customer.firstname + " " + customer.lastname + " dans " + this.travel.name + " ?";
    if (this.isGroup) {
      text = this.isLast() ? "Finaliser l'inscription du groupe ?" : "Passer au client suivant ?"
    }

    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        autoFocus: false,
        width: '534px',
        data: {
          text: text
        }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res === true) {
        this.validate();
      }
    });
  }

  openPrintDocumentsDialog() {
    let dialogRef = this.dialog.open(PrintDocumentsDialogComponent, {
        autoFocus: false,
        width: '534px',
        data: {
          travel: this.isEdit ? this.customerTravel.travel : this.travel,
          customers: this.isEdit ? [this.customerTravel.customer] : this.isGroup ? this.travelersSentToServer.map(x => x.customer) : [this.customers[this.customerIndex]]
        }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.travelersSentToServer = [];
      this.travelersToSave = [];
      this.gotoNext();
    });
  }

  gotoNext() {
    if (!this.isLast()) {
      this.selectedRelationship = null;
      this.customerIndex++;
      this.step = 0;
      window.scroll(0,0);

      if (this.isGroup) {
        this.addFeesFromUnpaidCustomers();
        this.buildHotelFeesFromGroup();
        var customer = this.customers[this.customerIndex];

        // Set the same hotels and flights by default if it's a group
        // this.customers[this.customerIndex - 1].hotelBookings = previousCustomer.hotelBookings;
        // this.customers[this.customerIndex].flightBookings = previousCustomer.flightBookings;
      }
    }
    else {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  onHotelsChange(feesAndBooking) {
    var allExceptHotelFee: Fee[] = this.fees.filter((x: Fee) => x.isServiceFee || x.isMandatoryFee);
    this.fees = allExceptHotelFee.concat(feesAndBooking.fees);
    this.customers[this.customerIndex].hotelBookings = feesAndBooking.hotelBookings;
  }

  onTravelServicesChange(feesAndBookings) {
    var mainFees: Fee[] = this.fees.filter((x: Fee) => !x.isServiceFee || x.isPreviousFee);
    this.fees = mainFees.concat(feesAndBookings.fees);
    // this.customers[this.customerIndex].hotelBookings = feesAndBookings.hotelBookings;
    // this.customers[this.customerIndex].flightBookings = feesAndBookings.flightBookings;
  }
  
  onPaymentChange(payment) {
    this.customers[this.customerIndex].payments = [payment];
  }

  private addFeesFromUnpaidCustomers() {
    var madatoryFees = this.fees.filter(x => x.isMandatoryFee && !x.isPreviousFee).map(x => ({ ...x }));

    // Start from fresh
    this.fees = [];

    // Add fees from previous customer
    var previousCustomer = this.customers[this.customerIndex - 1];
    if (previousCustomer.payments && previousCustomer.payments.length > 0 && previousCustomer.payments[0].payLater == true) {
      var customerFees: Fee[] = this.feesByCustomer[previousCustomer.id];
      if (previousCustomer.payments[0].discount > 0) {
        customerFees.push({ price: -previousCustomer.payments[0].discount, name: 'Discount ' + previousCustomer.firstname + ' ' + previousCustomer.lastname });
      }

      customerFees.forEach(x => x.isPreviousFee = true);
      this.fees = customerFees;
    }

    // Add main fees to the current customer
    this.fees = this.fees.concat(madatoryFees);
  }

  isLast() {
    return this.customerIndex >= this.customers.length -1;
  }

  private buildHotelFeesFromGroup() {
    if (!this.customers) return;

    var customer = this.customers[this.customerIndex];
    if (customer.hotelBookings) {
      this.customers[this.customerIndex].hotelBookings.forEach(booking => {
        booking.rooms.forEach(room => {
          if (room.customers && room.customers.length > 0 && room.customers[0].id == customer.id) {
            this.fees.push({ 
              name: booking.hotel.name + ' ' + room.roomType.name ,
              price:  room.customers[0].roomPrice
            })
          }
        })
      })
    }
  }
}
