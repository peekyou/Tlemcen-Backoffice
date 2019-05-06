import { Component, OnInit, Inject, Input, EventEmitter, Output } from '@angular/core';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Fee } from '../../../management/fees-management/fee.model';
import { FeeService } from '../../../management/fees-management/fee.service';
import { Customer } from '../../../customers/customer.model';
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
  selector: 'app-hotel-booking',
  templateUrl: './hotel-booking.component.html',
  styleUrls: ['./hotel-booking.component.scss']
})
export class HotelBookingComponent implements OnInit {
  form: FormGroup;
  loading: boolean;
  hotelFees: Fee[] = [];
  hotels: Hotel[];
  hotelsMekka: Hotel[];
  hotelsMedina: Hotel[];
  roomTypes: RoomType[];
  loader: Subscription;
  formData;
  _customer: CustomerDetail = new CustomerDetail();
  
  @Input() 
  set customer(customer: CustomerDetail) {
    this._customer = customer;
    if (this.form && !this.isGroup) {
      this.form.reset();
    }  
  }
  get customer(): CustomerDetail {
      return this._customer;
  }

  @Input() isGroup = false;
  @Input() customers: CustomerDetail[];
  @Output() onChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private hotelService: HotelsService,
    private customerService: CustomersService) {
  }

  ngOnInit() {
    this.initForm();
    
    this.loader = forkJoin(
      this.hotelService.getHotels(null, null),
      this.hotelService.getRoomTypes(null, null)
    )
    .subscribe(res => {
      this.hotels = res[0].data;
      this.hotelsMekka = this.hotels.filter(x => isMekka(x.address));
      this.hotelsMedina = this.hotels.filter(x => !isMekka(x.address));
      this.roomTypes = res[1];

      this.populateCustomerFees();
    })
  }

  initForm() {
    if (!this._customer.hotelBookings) {
      this._customer.hotelBookings = [];
    }

    // var hotelMekkaRoomPrices = this.fb.array([]);
    // var hotelMedinaRoomPrices = this.fb.array([]);
    // if (this.customers) {
    //   this.customers.forEach(c => {
    //     hotelMekkaRoomPrices.push(new FormControl());
    //     hotelMedinaRoomPrices.push(new FormControl());
    //   })
    // }

    // var mekkahPrice = null;
    // var medinaPrice = null;
    // if (this._customer.hotelBookings.length > 0 && this._customer.hotelBookings[0].rooms && this._customer.hotelBookings[0].rooms.length > 0){
    //   var makkahRoom = this._customer.hotelBookings[0].rooms[0];
    //   if (makkahRoom.customers && makkahRoom.customers.length > 0 && makkahRoom.customers[0].roomPrice != null) {
    //     mekkahPrice = makkahRoom.customers[0].roomPrice;
    //   }
    //   else {
    //     mekkahPrice = makkahRoom.price;
    //   }
    // }
    // if (this._customer.hotelBookings.length > 1 && this._customer.hotelBookings[1].rooms && this._customer.hotelBookings[1].rooms.length > 0){
    //   var medinaRoom = this._customer.hotelBookings[1].rooms[0];
    //   if (medinaRoom.customers && medinaRoom.customers.length > 0 && medinaRoom.customers[0].roomPrice != null) {
    //     medinaPrice = medinaRoom.customers[0].roomPrice;
    //   }
    //   else {
    //     medinaPrice = medinaRoom.price;
    //   }
    // }
    
    this.form = this.fb.group({
      hotelMekka: this.fb.control(this._customer.hotelBookings.length > 0 ? this._customer.hotelBookings[0].hotel.id : null),
      hotelMekkaRoom: this.fb.control(this._customer.hotelBookings.length > 0 && this._customer.hotelBookings[0].rooms && this._customer.hotelBookings[0].rooms.length > 0 && this._customer.hotelBookings[0].rooms[0].roomType ? this._customer.hotelBookings[0].rooms[0].roomType.id : 4),
      // hotelMekkaRoomPrice: this.fb.control(mekkahPrice),
      hotelMedina: this.fb.control(this._customer.hotelBookings.length > 1 ? this._customer.hotelBookings[1].hotel.id : null),
      hotelMedinaRoom: this.fb.control( this._customer.hotelBookings.length > 1 && this._customer.hotelBookings[1].rooms && this._customer.hotelBookings[1].rooms.length > 0 && this._customer.hotelBookings[1].rooms[0].roomType ? this._customer.hotelBookings[1].rooms[0].roomType.id : 4),
      // hotelMedinaRoomPrice: this.fb.control(medinaPrice),
      // hotelMekkaRoomPrices: hotelMekkaRoomPrices,
      // hotelMedinaRoomPrices: hotelMedinaRoomPrices
    });

    this.form.valueChanges.subscribe(data => {
      this.setHotelFees(data);
      this.emitChanges();
    });
  }

  populateCustomerFees() {
    // For edit mode
    this.setHotelFees(this.form.value);
    this.emitChanges();
  }

  setHotelFees(formData) {
    this.hotelFees = [];

    if (this.customers) {
      this.customers.forEach(c => c.hotelBookings = []);
      this.buildHotelBooking(formData.hotelMekka, formData.hotelMekkaRoom, formData.hotelMekkaRoomPrices);
      this.buildHotelBooking(formData.hotelMedina, formData.hotelMedinaRoom, formData.hotelMedinaRoomPrices);
    }
    else {
      this._customer.hotelBookings = [];
      this.buildHotelBooking(formData.hotelMekka, formData.hotelMekkaRoom, formData.hotelMekkaRoomPrice);
      this.buildHotelBooking(formData.hotelMedina, formData.hotelMedinaRoom, formData.hotelMedinaRoomPrice);
    }
  }

  emitChanges() {
    this.onChange.emit({ 
      fees: this.hotelFees,
      hotelBookings: this._customer.hotelBookings,
      customers: this.customers
    });
  }

  buildHotelBooking(hotelId, roomTypeId, price) {
    if (hotelId && roomTypeId) {
      var hotel = this.hotels.find(x => x.id == hotelId);
      var roomType = this.roomTypes.find(x => x.id == roomTypeId);
      // var fees = price && !Array.isArray(price) ? price : null;
      // this.hotelFees.push({ 
      //   name: hotel.name + ' ' + roomType.name,
      //   price: fees
      // });

      if (this.customers) {
        this.customers.forEach((c, i) => {
          c.hotelBookings.push({
            hotel: { id: hotelId, name: hotel.name },
            rooms: [{
              roomType: { id: roomTypeId, name: roomType.name },
              customers: [{ id: c.id, roomPrice: null/*price[i]*/ }]
            }]
          });
        });
      }
      else {
        this._customer.hotelBookings.push({
          hotel: { id: hotelId },
          rooms: [{
            //price: fees,
            roomType: { id: roomTypeId },
            customers: [{ id: this._customer.id }]
          }]
        });
      }
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
  }
  
  get hotelMekka() { return this.form.get('hotelMekka'); }
  get hotelMedina() { return this.form.get('hotelMedina'); }
}
