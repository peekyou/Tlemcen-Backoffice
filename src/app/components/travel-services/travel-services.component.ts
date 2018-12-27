import { Component, OnInit, Inject, Input, EventEmitter, Output } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Fee } from '../../management/fees-management/fee.model';
import { FeeService } from '../../management/fees-management/fee.service';
import { Customer } from '../../customers/customer.model';
import { CustomersService } from '../../customers/customers.service';
import { Hotel, RoomType } from '../../hotels/hotel.model';
import { HotelsService } from '../../hotels/hotels.service';
import { AirlinesService } from '../../airlines/airlines.service';
import { HotelReservation } from '../../hotels/hotel-reservation.model';
import { FlightBooking } from '../../airlines/flight-booking.model';
import { Airline } from '../../airlines/airline.model';
import { validateDate, filterLookup } from '../../core/helpers/utils';
import { Lookup } from '../../core/models/lookup.model';
import { LookupService } from '../../core/services/lookup.service';

@Component({
  selector: 'app-travel-services',
  templateUrl: './travel-services.component.html',
  styleUrls: ['./travel-services.component.scss']
})
export class TravelServicesComponent implements OnInit {
  form: FormGroup;
  loading: boolean;
  fees: Fee[];
  selectedFees: Fee[] = [];
  hotelsAndFlightsFees: Fee[] = [];
  hotelBookings: HotelReservation[] = [];
  flightBookings: FlightBooking[] = [];
  hotels: Hotel[];
  airlines: Airline[];
  airports: Lookup[];
  filteredAirports: Observable<Lookup[]>;
  filteredAirports2: Observable<Lookup[]>;
  filteredAirports3: Observable<Lookup[]>;
  filteredAirports4: Observable<Lookup[]>;
  filteredAirports5: Observable<Lookup[]>;
  filteredAirports6: Observable<Lookup[]>;
  filteredAirports7: Observable<Lookup[]>;
  filteredAirports8: Observable<Lookup[]>;
  roomTypes: RoomType[];
  loader: Subscription;
  validateDate: Function;
  formData;

  @Input() customer: Customer;
  @Input() travel;
  @Output() onChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private feeService: FeeService,
    private hotelService: HotelsService,
    private airlineService: AirlinesService,
    private customerService: CustomersService,
    private lookupService: LookupService) {

      this.lookupService.fetchAirports('fr').subscribe(res => {
        this.airports = res;
      });

      this.validateDate = validateDate;
      hotelService.getHotels(null, null).subscribe(res => this.hotels = res.data);
      hotelService.getRoomTypes(null, null).subscribe(res => this.roomTypes = res);
      airlineService.getAirlines(null, null).subscribe(res => this.airlines = res.data);
  }

  ngOnInit() {
    this.form = this.fb.group({
      hotelMekka: this.fb.control(null),
      hotelMekkaRoom: this.fb.control(null),
      hotelMekkaRoomPrice: this.fb.control(null),
      hotelMedina: this.fb.control(null),
      hotelMedinaRoom: this.fb.control(null),
      hotelMedinaRoomPrice: this.fb.control(null),


      airlineOneWay1: this.fb.control(null),
      flightOneWay1Departure: this.fb.control(null),
      flightOneWay1Arrival: this.fb.control(null),
      flightOneWay1Date: this.fb.control(null),
      flightOneWay1Price: this.fb.control(null),

      airlineOneWay2: this.fb.control(null),
      flightOneWay2Departure: this.fb.control(null),
      flightOneWay2Arrival: this.fb.control(null),
      flightOneWay2Date: this.fb.control(null),
      flightOneWay2Price: this.fb.control(null),
      

      airlineReturn1: this.fb.control(null),
      flightReturn1Departure: this.fb.control(null),
      flightReturn1Arrival: this.fb.control(null),
      flightReturn1Date: this.fb.control(null),
      flightReturn1Price: this.fb.control(null),

      airlineReturn2: this.fb.control(null),
      flightReturn2Departure: this.fb.control(null),
      flightReturn2Arrival: this.fb.control(null),
      flightReturn2Date: this.fb.control(null),
      flightReturn2Price: this.fb.control(null),
    });

    this.form.valueChanges.subscribe(data => {
      this.setHotelAndFlightsFees(data);
      
      this.onChange.emit({ 
        fees: this.selectedFees.concat(this.hotelsAndFlightsFees),
        hotelBookings: this.hotelBookings,
        flightBookings: this.flightBookings
      });
    });
    
    if (this.travel) {
      this.loader = this.feeService.getFeesByCategory(this.travel.travelTypeId)
        .subscribe(res => {
          this.fees = res;
          this.fees.forEach(f => f.isServiceFee = true);
        });
    }

    this.filteredAirports = this.flightOneWay1Departure.valueChanges
    .pipe(
        startWith(''),
        debounceTime(200),
        distinctUntilChanged(),
        map(option => option && option.length >= 2 ? filterLookup(option, this.airports) : [])
    );

    this.filteredAirports2 = this.flightOneWay1Arrival.valueChanges
    .pipe(
        startWith(''),
        debounceTime(200),
        distinctUntilChanged(),
        map(option => option && option.length >= 2 ? filterLookup(option, this.airports) : [])
    );

    this.filteredAirports3 = this.flightOneWay2Departure.valueChanges
    .pipe(
        startWith(''),
        debounceTime(200),
        distinctUntilChanged(),
        map(option => option && option.length >= 2 ? filterLookup(option, this.airports) : [])
    );

    this.filteredAirports4 = this.flightOneWay2Arrival.valueChanges
    .pipe(
        startWith(''),
        debounceTime(200),
        distinctUntilChanged(),
        map(option => option && option.length >= 2 ? filterLookup(option, this.airports) : [])
    );

    this.filteredAirports5 = this.flightReturn1Departure.valueChanges
    .pipe(
        startWith(''),
        debounceTime(200),
        distinctUntilChanged(),
        map(option => option && option.length >= 2 ? filterLookup(option, this.airports) : [])
    );

    this.filteredAirports6 = this.flightReturn1Arrival.valueChanges
    .pipe(
        startWith(''),
        debounceTime(200),
        distinctUntilChanged(),
        map(option => option && option.length >= 2 ? filterLookup(option, this.airports) : [])
    );

    this.filteredAirports7 = this.flightReturn2Departure.valueChanges
    .pipe(
        startWith(''),
        debounceTime(200),
        distinctUntilChanged(),
        map(option => option && option.length >= 2 ? filterLookup(option, this.airports) : [])
    );

    this.filteredAirports8 = this.flightReturn2Arrival.valueChanges
    .pipe(
        startWith(''),
        debounceTime(200),
        distinctUntilChanged(),
        map(option => option && option.length >= 2 ? filterLookup(option, this.airports) : [])
    );
  }

  serviceChecked(event, fee) {
    var index = this.selectedFees.indexOf(fee);
    if (event.checked && index == -1) {
      this.selectedFees.push(fee);
    }
    else {
      this.selectedFees.splice(index, 1);
    }

    this.onChange.emit({ 
      fees: this.selectedFees.concat(this.hotelsAndFlightsFees),
      hotelBookings: this.hotelBookings,
      flightBookings: this.flightBookings
    });
  }

  setHotelAndFlightsFees(formData) {
    this.hotelsAndFlightsFees = [];
    this.hotelBookings = [];
    this.flightBookings = [];

    this.buildHotelBooking(formData.hotelMekka, formData.hotelMekkaRoom, formData.hotelMekkaRoomPrice);
    this.buildHotelBooking(formData.hotelMedina, formData.hotelMedinaRoom, formData.hotelMedinaRoomPrice);

    this.buildFlightBooking(formData.airlineOneWay1, formData.flightOneWay1Departure, formData.flightOneWay1Arrival, formData.flightOneWay1Price, formData.flightOneWay1Date, formData.flightOneWay1Date);
    this.buildFlightBooking(formData.airlineOneWay2, formData.flightOneWay2Departure, formData.flightOneWay2Arrival, formData.flightOneWay2Price, formData.flightOneWay2Date, formData.flightOneWay2Date);
    this.buildFlightBooking(formData.airlineReturn1, formData.flightReturn1Departure, formData.flightReturn1Arrival, formData.flightReturn1Price, formData.flightReturn1Date, formData.flightReturn1Date);
    this.buildFlightBooking(formData.airlineReturn2, formData.flightReturn2Departure, formData.flightReturn2Arrival, formData.flightReturn2Price, formData.flightReturn2Date, formData.flightReturn2Date);
  }

  buildHotelBooking(hotel, hotelRoom, price) {
    if (hotel && hotelRoom) {
      var fee = price ? price : 0;
      this.hotelsAndFlightsFees.push({ 
        name: hotel.name + ' ' + hotelRoom.name,
        price: fee
      });

      this.hotelBookings.push({
        hotel: { id: hotel.id },
        rooms: [{
          price: fee,
          roomType: { id: hotelRoom.id },
          customers: [{ id: this.customer.id }]
        }]
      });
    }
  }

  buildFlightBooking(airline, departure, arrival, price, departureDate, arrivalDate) {
    if (airline && departure && arrival) {
      var fee = price ? price : 0;
      this.hotelsAndFlightsFees.push({ 
        name: airline.name,
        price: fee
      });

      this.flightBookings.push({
        price: fee,
        departureDate: departureDate,
        arrivalDate: arrivalDate,
        flight: {
          airline: { id: airline.id },
          airportFrom: departure.id,
          airportTo: arrival.id 
        }
      });
    }
  }

  displayFn(val: Lookup) {
    return val ? val.name : val;
  }
  
  get hotelMekka() { return this.form.get('hotelMekka'); }
  get hotelMedina() { return this.form.get('hotelMedina'); }
  get airlineOneWay1() { return this.form.get('airlineOneWay1'); }
  get airlineOneWay2() { return this.form.get('airlineOneWay2'); }
  get airlineReturn1() { return this.form.get('airlineReturn1'); }
  get airlineReturn2() { return this.form.get('airlineReturn2'); }

  get flightOneWay1Departure() { return this.form.get('flightOneWay1Departure'); }
  get flightOneWay1Arrival() { return this.form.get('flightOneWay1Arrival'); }
  get flightOneWay2Departure() { return this.form.get('flightOneWay2Departure'); }
  get flightOneWay2Arrival() { return this.form.get('flightOneWay2Arrival'); }
  get flightReturn1Departure() { return this.form.get('flightReturn1Departure'); }
  get flightReturn1Arrival() { return this.form.get('flightReturn1Arrival'); }
  get flightReturn2Departure() { return this.form.get('flightReturn2Departure'); }
  get flightReturn2Arrival() { return this.form.get('flightReturn2Arrival'); }
}
