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
  form: FormGroup;
  loading: boolean;
  fees: Fee[];
  hotelFees: Fee[] = [];
  flightFees: Fee[] = [];
  hotels: Hotel[];
  hotelsMekka: Hotel[];
  hotelsMedina: Hotel[];
  roomTypes: RoomType[];
  takeHotelsSeparately = false;
  takeFlightsSeparately = false;
  loader: Subscription;
  formData;
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
      this.feeService.getFeesByCategory(this.travelTypeId),
      this.hotelService.getHotels(null, null),
      this.hotelService.getRoomTypes(null, null)
    )
    .subscribe(res => {
      this.fees = res[0];
      this.hotels = res[1].data;
      this.hotelsMekka = this.hotels.filter(x => isMekka(x.address));
      this.hotelsMedina = this.hotels.filter(x => !isMekka(x.address));
      this.roomTypes = res[2];

      this.fees.forEach(f => f.isServiceFee = true);
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

    this.form = this.fb.group({
      hotelMekka: this.fb.control(this.takeHotelsSeparately && this.customer.hotelBookings.length > 0 ? this.customer.hotelBookings[0].hotel.id : null),
      hotelMekkaRoom: this.fb.control(this.takeHotelsSeparately && this.customer.hotelBookings.length > 0 && this.customer.hotelBookings[0].rooms && this.customer.hotelBookings[0].rooms.length > 0 && this.customer.hotelBookings[0].rooms[0].roomType ? this.customer.hotelBookings[0].rooms[0].roomType.id : null),
      hotelMekkaRoomPrice: this.fb.control(this.takeHotelsSeparately && this.customer.hotelBookings.length > 0 && this.customer.hotelBookings[0].rooms && this.customer.hotelBookings[0].rooms.length > 0 ? this.customer.hotelBookings[0].rooms[0].price : null),
      hotelMedina: this.fb.control(this.takeHotelsSeparately && this.customer.hotelBookings.length > 1 ? this.customer.hotelBookings[1].hotel.id : null),
      hotelMedinaRoom: this.fb.control(this.takeHotelsSeparately && this.customer.hotelBookings.length > 1 && this.customer.hotelBookings[1].rooms && this.customer.hotelBookings[1].rooms.length > 0 && this.customer.hotelBookings[1].rooms[0].roomType ? this.customer.hotelBookings[1].rooms[0].roomType.id : null),
      hotelMedinaRoomPrice: this.fb.control(this.takeHotelsSeparately && this.customer.hotelBookings.length > 1 && this.customer.hotelBookings[1].rooms && this.customer.hotelBookings[1].rooms.length > 0 ? this.customer.hotelBookings[1].rooms[0].price : null),
    });

    this.form.valueChanges.subscribe(data => {
      this.setHotelFees(data);
      this.emitChanges();
    });
  }

  populateCustomerFees() {
    if (this.customer && this.customer.additionalFees) {
      this.customer.additionalFees.forEach(fee => {
        var fee = this.fees.find(f => f.id == fee.id);
        if (fee) {
          fee.checked = true;
        }
      });
    }
    
    // For edit mode
    this.setHotelFees(this.form.value);
    this.emitChanges();
  }

  serviceChecked(event, fee) {
    this.emitChanges();
  }

  setHotelFees(formData) {
    this.hotelFees = [];
    this.customer.hotelBookings = [];

    this.buildHotelBooking(formData.hotelMekka, formData.hotelMekkaRoom, formData.hotelMekkaRoomPrice);
    this.buildHotelBooking(formData.hotelMedina, formData.hotelMedinaRoom, formData.hotelMedinaRoomPrice);
  }

  onFlightsChange(flights) {
    this.customer.flightBookings = flights.flightBookings;
    this.flightFees = flights.flightFees;
    this.emitChanges();
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

  buildHotelBooking(hotelId, roomTypeId, price) {
    if (hotelId && roomTypeId) {
      var hotel = this.hotels.find(x => x.id == hotelId);
      var roomType = this.roomTypes.find(x => x.id == roomTypeId);
      var fee = price ? price : 0;
      this.hotelFees.push({ 
        name: hotel.name + ' ' + roomType.name,
        price: fee
      });

      this.customer.hotelBookings.push({
        hotel: { id: hotelId },
        rooms: [{
          price: fee,
          roomType: { id: roomTypeId },
          customers: [{ id: this.customer.id }]
        }]
      });
    }
  }

  reset() {
    if (this.form && !this.isGroup) {
      this.form.reset();
    }
    else if (this.form) {
      // If this is a group, we keep the hotels, so we need to emit the 
      // this.setHotelFees(this.form.value);
      // this.emitChanges();
    }

    if (this.fees) {
      this.fees.forEach(f => {
        f.checked = false;
      });
    }
  }
  
  get hotelMekka() { return this.form.get('hotelMekka'); }
  get hotelMedina() { return this.form.get('hotelMedina'); }
}
