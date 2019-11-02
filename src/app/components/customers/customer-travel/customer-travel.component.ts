import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

import { PrintDocumentsDialogComponent } from '../../travels/print-documents-dialog/print-documents-dialog.component';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';
import { GroupPaymentsDialogComponent } from '../../payment/group-payments-dialog/group-payments-dialog.component';
import { CustomerDialogComponent } from '../../customers/customer-dialog/customer-dialog.component';
import { CustomerDetail } from '../../../customers/customer-detail.model';
import { TravelGroup } from '../../../travels/travel-group.model';
import { TravelType } from '../../../travels/travel.model';
import { Payment } from '../../../payments/payment.model';
import { TravelService } from '../../../travels/travel.service';
import { Fee } from '../../../management/fees-management/fee.model';
import { HotelReservation } from '../../../hotels/hotel-reservation.model';
import { FlightBooking } from '../../../airlines/flight-booking.model';
import { CustomerTravel } from '../../../customers/customer-travel.model';
import { Lookup } from '../../../core/models/lookup.model';
import { LookupService } from '../../../core/services/lookup.service';
import { generateGroupId } from '../../../core/helpers/utils';
import { ModalButtons } from '../../../core/models/modal';

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
  canPay: boolean = true;
  selectedCustomer: CustomerDetail;
  currentPayment: Payment;
  loader: Subscription;
  groupId: string;
  customersSaved: string[] = [];

  @Input() travelGroup: TravelGroup;
  @Input() isGroup: boolean = false;
  @Input() isEdit: boolean = false;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private lookupService: LookupService,
    private travelService: TravelService) { 

  }

  ngOnInit() {
    this.selectedCustomer = this.travelGroup && this.travelGroup.customers ? this.travelGroup.customers[0] : null;
    this.canPay = !this.isGroup;
    if (this.isGroup) {
      this.groupId = generateGroupId();
    }


    // In case of group build the fees from the private booking
    this.buildHotelFeesFromGroup();

    this.lookupService.fetchRelationships('fr').subscribe(res => {
      this.relationships = res;
      if (this.travelGroup && this.travelGroup.customers && this.travelGroup.customers.length > 0 && this.travelGroup.customers[0].relationship) {
        this.selectedRelationship = res.find(x => x.name == this.travelGroup.customers[0].relationship);
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
    this.fees.forEach(f => {
      if (f.isServiceFee) {
        additionalFee.push(f);
      }
    });

    var customer = this.travelGroup.customers[this.customerIndex];
    customer.additionalFees = additionalFee;
    if (this.selectedRelationship) {
      customer.relationship = this.selectedRelationship.name;
    }

    this.loading = true;

    // Create a copy to avoid erasing the previous payments
    var customerCopy = JSON.parse(JSON.stringify(customer));
    customerCopy.payments = [this.currentPayment];
    this.saveTraveler({
      customer: customerCopy,
      travel: this.travelGroup.travel,
      groupId: this.travelGroup.groupId ? this.travelGroup.groupId : this.groupId
    })
    .subscribe(
      res => {
        this.loading = false;
        this.updateSelectedCustomer(customerCopy.id);
        this.customersSaved.push(customerCopy.id);
        this.gotoCustomer();
      },
      err => this.loading = false);
  }

  saveTraveler(customerTravel: CustomerTravel): Observable<string> {
    return this.isEdit || this.customersSaved.indexOf(customerTravel.customer.id) > -1 ? 
      this.travelService.updateTraveler(customerTravel) 
      : 
      this.travelService.addTravelers([customerTravel]);
  }

  openConfirmationDialog() {
    var customer = this.travelGroup.customers[this.customerIndex];
    var text = "Valider l'inscription de " + customer.firstname + " " + customer.lastname + " dans " + this.travelGroup.travel.name + " ?";
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

  openPrintDocumentsDialog(redirectBack = false) {
    if (!this.isEdit && this.customersSaved.length < this.travelGroup.customers.length) {
      this.showNotSavedCustomerPopup(redirectBack);
    }
    else {
      let dialogRef = this.dialog.open(PrintDocumentsDialogComponent, {
          autoFocus: false,
          width: '534px',
          data: {
            travel: this.travelGroup.travel,
            customers: this.travelGroup.customers
          }
      });

      if (redirectBack) {
        dialogRef.afterClosed().subscribe(res => {
          this.goBack();
        });
      }
    }
  }

  openGroupPaymentsDialog() {
    if (!this.isEdit && this.customersSaved.length < this.travelGroup.customers.length) {
      this.showNotSavedCustomerPopup();
    }
    else {
      let dialogRef = this.dialog.open(GroupPaymentsDialogComponent, {
        autoFocus: false,
        width: '900px',
        height: '500px',
        data: {
          travel: this.travelGroup.travel,
          customers: this.travelGroup.customers,
          groupId: this.travelGroup.groupId ? this.travelGroup.groupId : this.groupId
        }
      });

      dialogRef.afterClosed().subscribe(customers => {
        if (customers != null) {
          this.travelGroup.customers = customers;
          this.selectedCustomer = customers.find(x => x.id == this.selectedCustomer.id);
        }
      });
    }
  }

  openCustomerDialog() {
    let dialogRef = this.dialog.open(CustomerDialogComponent, {
      autoFocus: false,
      width: '534px',
      data: {
        customer: this.selectedCustomer,
      }
    });

    dialogRef.afterClosed().subscribe(customer => {
      if (customer) {
        if (this.selectedCustomer.firstname != customer.firstname) {
          this.selectedCustomer.firstname = customer.firstname;
          this.travelGroup.customers[this.customerIndex].firstname = customer.firstname;
        }
        if (this.selectedCustomer.lastname != customer.lastname) {
          this.selectedCustomer.lastname = customer.lastname;
          this.travelGroup.customers[this.customerIndex].lastname = customer.lastname;
        }
      }
    });
  }

  showNotSavedCustomerPopup(redirectToNotSavedCutomer = false) {
    var notsaved = '';
    var gotoIndex = -1;
    this.travelGroup.customers.forEach((c, i) => {
      if (this.customersSaved.indexOf(c.id) == -1) {
        notsaved += c.firstname + ' ' + c.lastname + ', ';
        if (gotoIndex == -1) {
          gotoIndex = i;
        }
      }
    });

    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        autoFocus: false,
        width: '500px',
        data: {
          text: 'Veuillez sauvegarder le(s) client(s) : ' + notsaved.substring(0, notsaved.length - 2),
          buttons: ModalButtons.Ok
        }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (redirectToNotSavedCutomer) {
        this.gotoCustomer(gotoIndex);
      }
    });
  }

  gotoCustomer(index: number = null) {
    if (!this.isLast() || index != null) {
      this.customerIndex = index != null ? index : this.customerIndex + 1;
      this.selectedRelationship = null;
      this.selectedCustomer = this.travelGroup.customers[this.customerIndex];
      this.fees = this.fees.filter((x: Fee) => !x.isServiceFee);
      this.step = 0;
      if (this.selectedCustomer.relationship) {
        this.selectedRelationship = this.relationships.find(x => x.name == this.selectedCustomer.relationship);
      }
      window.scroll(0,0);

      if (this.isGroup) {
        this.buildHotelFeesFromGroup();
        var customer = this.travelGroup.customers[this.customerIndex];

        // Set the same hotels and flights by default if it's a group
        // this.customers[this.customerIndex - 1].hotelBookings = previousCustomer.hotelBookings;
        // this.customers[this.customerIndex].flightBookings = previousCustomer.flightBookings;
      }
    }
    else {
      this.openPrintDocumentsDialog(true);
    }
  }

  onHotelsChange(feesAndBooking) {
    var allExceptHotelFee: Fee[] = this.fees.filter((x: Fee) => x.isServiceFee || x.isMandatoryFee);
    this.fees = allExceptHotelFee.concat(feesAndBooking.fees);
    this.travelGroup.customers[this.customerIndex].hotelBookings = feesAndBooking.hotelBookings;
  }

  onDocumentsChange(documents) {
    this.travelGroup.customers[this.customerIndex].documents = documents;    
  }

  onTravelServicesChange(feesAndBookings) {
    var mainFees: Fee[] = this.fees.filter((x: Fee) => !x.isServiceFee);
    // mainFees.forEach(f => {
    //   var index = this.fees.indexOf(f);
    //   if (index == -1) {
    //     feesAndBookings.unshift(f);
    //   }
    // })
    this.fees = mainFees.concat(feesAndBookings.fees);
    // this.customers[this.customerIndex].hotelBookings = feesAndBookings.hotelBookings;
    // this.customers[this.customerIndex].flightBookings = feesAndBookings.flightBookings;
  }
  
  onPaymentChange(payment) {
    this.currentPayment = payment;
  }

  onExistingPaymentUpdated(customerId) {
    this.updateSelectedCustomer(customerId, true);
  }

  updateSelectedCustomer(customerId, updateSelected = false) {
    this.travelService.getTraveler(this.travelGroup.travel.id, customerId, true)
    .subscribe(res => {
      var c = this.travelGroup.customers.find(x => x.id == customerId);
      var index = this.travelGroup.customers.indexOf(c);
      this.travelGroup.customers[index] = res.customer;
      if (updateSelected) {
        this.selectedCustomer = res.customer;
      }
    });
  }

  isLast() {
    return this.customerIndex >= this.travelGroup.customers.length -1;
  }

  onCustomerSelected($event) {
    var customer: CustomerDetail = $event.value;
    var index = this.travelGroup.customers.indexOf(customer);
    if (index > -1) {
      if (this.isEdit || this.customersSaved.indexOf(customer.id) > -1) {
        this.loader = this.travelService.getTraveler(this.travelGroup.travel.id, customer.id, true)
          .subscribe(res => {
            this.travelGroup.customers[index] = res.customer;
            this.gotoCustomer(index);
          });
      }
      else {
        this.gotoCustomer(index);
      }
    }
  }

  goBack() {
    var path = this.travelGroup.travel.travelTypeId == TravelType.Omra ? 'omra' : this.travelGroup.travel.travelTypeId == TravelType.Hajj ? 'hajj' : 'travel';
    this.router.navigate(['/' + path, this.travelGroup.travel.id]);
  }

  private buildHotelFeesFromGroup() {
    if (!this.travelGroup.customers) return;

    var customer = this.travelGroup.customers[this.customerIndex];
    if (customer.hotelBookings) {
      customer.hotelBookings.forEach(booking => {
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
