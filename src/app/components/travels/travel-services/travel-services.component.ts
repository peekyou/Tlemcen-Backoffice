import { Component, OnInit, Inject, Input, EventEmitter, Output } from '@angular/core';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Fee } from '../../../management/fees-management/fee.model';
import { FeeService } from '../../../management/fees-management/fee.service';
import { CustomerDetail } from '../../../customers/customer-detail.model';
import { CustomersService } from '../../../customers/customers.service';
import { Hotel, RoomType } from '../../../hotels/hotel.model';
import { HotelsService } from '../../../hotels/hotels.service';
import { AirlinesService } from '../../../airlines/airlines.service';
import { HotelReservation } from '../../../hotels/hotel-reservation.model';
import { FlightBooking } from '../../../airlines/flight-booking.model';
import { Airline } from '../../../airlines/airline.model';
import { validateDate, filterLookup } from '../../../core/helpers/utils';
import { Lookup } from '../../../core/models/lookup.model';
import { LookupService } from '../../../core/services/lookup.service';
import { isMekka } from '../../../core/helpers/utils';

@Component({
  selector: 'app-travel-services',
  templateUrl: './travel-services.component.html',
  styleUrls: ['./travel-services.component.scss']
})
export class TravelServicesComponent implements OnInit {
  fees: Fee[];
  hotelFees: Fee[] = [];
  flightFees: Fee[] = [];
  takeHotelsSeparately = false;
  takeFlightsSeparately = false;
  loader: Subscription;
  _customer: CustomerDetail = {};

  @Input() 
  set customer(customer: CustomerDetail) {
    this._customer = customer;
    this.reset();
  }
  get customer(): CustomerDetail {
      return this._customer;
  }

  @Input() travelTypeId;
  @Input() isGroup = false;
  @Output() onChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private feeService: FeeService,
    private hotelService: HotelsService,
    private airlineService: AirlinesService,
    private customerService: CustomersService,
    private lookupService: LookupService) {
  }

  ngOnInit() {
    this.initForm();
    
    this.loader = forkJoin(
      this.feeService.getFeesByCategory(this.travelTypeId)
    )
    .subscribe(res => {
      this.fees = res[0];
      this.fees.forEach(x => {
        x.isServiceFee = true;
        if (x.price == null) {
          x.isDynamic = true;
        }
      });

      this.populateCustomerFees();
    })
  }

  initForm() {
    if (this.customer && this.customer.hotelBookings && this.customer.hotelBookings.length > 0) {
      for (var i = 0; i < this.customer.hotelBookings.length; i++) {
        if (this.customer.hotelBookings[i].rooms && this.customer.hotelBookings[i].rooms.length > 0) {
          this.takeHotelsSeparately = true;
          break;
        }
      }
    }
    if (this.customer && this.customer.flightBookings && this.customer.flightBookings.length > 0) {
      this.takeFlightsSeparately = true;
    }
  }

  populateCustomerFees() {
    if (this.customer && this.customer.additionalFees) {
      this.customer.additionalFees.forEach(customerFee => {
        var fee = this.fees.find(f => f.id == customerFee.id);
        if (fee) {
          fee.checked = true;
          if (fee.isDynamic) {
            fee.price = customerFee.price;
          }
        }
      });
    }
    
    // For edit mode
    this.emitChanges();
  }

  serviceChecked(event, fee) {
    this.emitChanges();
  }

  onFlightsChange(flights) {
    this.customer.flightBookings = flights.flightBookings;
    this.flightFees = flights.flightFees;
    this.emitChanges();
  }

  onHotelsChange(hotels) {
    
  }

  emitChanges() {
    var selectedFees = this.fees ? this.fees.filter(f => f.checked) : [];
    if (this.takeHotelsSeparately) {
      selectedFees = selectedFees.concat(this.hotelFees);
    }
    if (this.takeFlightsSeparately) {
      selectedFees = selectedFees.concat(this.flightFees);
    }

    this.onChange.emit({ 
      fees: selectedFees,
      hotelBookings: this.takeHotelsSeparately ? this.customer.hotelBookings : [],
      flightBookings: this.takeFlightsSeparately ? this.customer.flightBookings : []
    });
  }

  reset() {
    if (this.fees) {
      this.fees.forEach(f => {
        f.checked = false;
      });
    }
  }
}
