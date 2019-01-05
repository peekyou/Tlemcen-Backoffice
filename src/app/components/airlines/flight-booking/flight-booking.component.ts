import { Component, OnInit, Inject, Input, EventEmitter, Output } from '@angular/core';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AirlinesService } from '../../../airlines/airlines.service';
import { Fee } from '../../../management/fees-management/fee.model';
import { FlightBooking } from '../../../airlines/flight-booking.model';
import { Airline } from '../../../airlines/airline.model';
import { validateDate, filterLookup } from '../../../core/helpers/utils';
import { Lookup } from '../../../core/models/lookup.model';
import { LookupService } from '../../../core/services/lookup.service';
import { CustomerDetail } from '../../../customers/customer-detail.model';

@Component({
  selector: 'app-flight-booking',
  templateUrl: './flight-booking.component.html',
  styleUrls: ['./flight-booking.component.scss']
})
export class FlightBookingComponent implements OnInit {
  loader: Subscription;
  form: FormGroup;
  flightFees: Fee[] = [];
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
  validateDate: Function;
  // flightBookings: FlightBooking[] = [];
  
  _customer: CustomerDetail = {};
  
  @Input() 
  set customer(customer: CustomerDetail) {
    this._customer = customer;
    if (this.form) {
      this.form.reset();
    }  
  }
  get customer(): CustomerDetail {
      return this._customer;
  }

  @Input() dialog: boolean = false;
  @Output() onChange: EventEmitter<any> = new EventEmitter();

  // @Input() 
  // set flightBookings(flightBookings: FlightBooking[]) {
  //   this._customer.flightBookings = flightBookings;
  //   if (this.form) {
  //     this.form.reset();
  //   }
  // }
  // get flightBookings(): FlightBooking[] {
  //   return this._customer.flightBookings;
  // }
  
  constructor(
    private fb: FormBuilder,
    private airlineService: AirlinesService,
    private lookupService: LookupService) {

      this.validateDate = validateDate;
  }

  ngOnInit() {
    this.initForm();
    this.initAutocompletes();

    this.loader = forkJoin(
      this.airlineService.getAirlines(null, null),
      this.lookupService.fetchAirports('fr')
    )
    .subscribe(res => {
      this.airlines = res[0].data;
      this.airports = res[1];
      
      // For edit mode
      this.setFlightsFees(this.form.value);
      this.emitChanges();
    });
  }

  initForm() {
    // Init flight bookings with empty values
    if (!this._customer.flightBookings) {
      this._customer.flightBookings = [];
    }
    for (var i = 0; i < 4; i++) {
      if (i >= this._customer.flightBookings.length) {
        this._customer.flightBookings.push({});
      }
    }

    this.form = this.fb.group({
      airlineOneWay1: this.fb.control(this._customer.flightBookings[0].flight != null && this._customer.flightBookings[0].flight.airline != null ? this._customer.flightBookings[0].flight.airline.id : null),
      flightOneWay1Departure: this.fb.control(this._customer.flightBookings[0].flight != null ? this._customer.flightBookings[0].flight.airportFrom : null),
      flightOneWay1Arrival: this.fb.control(this._customer.flightBookings[0].flight != null ? this._customer.flightBookings[0].flight.airportTo : null),
      flightOneWay1Date: this.fb.control(this._customer.flightBookings[0].departureDate),
      flightOneWay1Price: this.fb.control(this._customer.flightBookings[0].price),

      airlineOneWay2: this.fb.control(this._customer.flightBookings[1].flight != null && this._customer.flightBookings[1].flight.airline != null ? this._customer.flightBookings[1].flight.airline.id : null),
      flightOneWay2Departure: this.fb.control(this._customer.flightBookings[1].flight != null ? this._customer.flightBookings[1].flight.airportFrom : null),
      flightOneWay2Arrival: this.fb.control(this._customer.flightBookings[1].flight != null ? this._customer.flightBookings[1].flight.airportTo : null),
      flightOneWay2Date: this.fb.control(this._customer.flightBookings[1].departureDate),
      flightOneWay2Price: this.fb.control(this._customer.flightBookings[1].price),
      

      airlineReturn1: this.fb.control(this._customer.flightBookings[2].flight != null && this._customer.flightBookings[2].flight.airline != null ? this._customer.flightBookings[2].flight.airline.id : null),
      flightReturn1Departure: this.fb.control(this._customer.flightBookings[2].flight != null ? this._customer.flightBookings[2].flight.airportFrom : null),
      flightReturn1Arrival: this.fb.control(this._customer.flightBookings[2].flight != null ? this._customer.flightBookings[2].flight.airportTo : null),
      flightReturn1Date: this.fb.control(this._customer.flightBookings[2].departureDate),
      flightReturn1Price: this.fb.control(this._customer.flightBookings[2].price),

      airlineReturn2: this.fb.control(this._customer.flightBookings[3].flight != null && this._customer.flightBookings[3].flight.airline != null ? this._customer.flightBookings[3].flight.airline.id : null),
      flightReturn2Departure: this.fb.control(this._customer.flightBookings[3].flight != null ? this._customer.flightBookings[3].flight.airportFrom : null),
      flightReturn2Arrival: this.fb.control(this._customer.flightBookings[3].flight != null ? this._customer.flightBookings[3].flight.airportTo : null),
      flightReturn2Date: this.fb.control(this._customer.flightBookings[3].departureDate),
      flightReturn2Price: this.fb.control(this._customer.flightBookings[3].price),
    });

    this.form.valueChanges.subscribe(data => {
      this.setFlightsFees(data);
      this.emitChanges();
    });
  }

  initAutocompletes() {
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

  setFlightsFees(formData) {
    this.flightFees = [];
    this._customer.flightBookings = [];

    this.buildFlightBooking(formData.airlineOneWay1, formData.flightOneWay1Departure, formData.flightOneWay1Arrival, formData.flightOneWay1Price, formData.flightOneWay1Date, formData.flightOneWay1Date);
    this.buildFlightBooking(formData.airlineOneWay2, formData.flightOneWay2Departure, formData.flightOneWay2Arrival, formData.flightOneWay2Price, formData.flightOneWay2Date, formData.flightOneWay2Date);
    this.buildFlightBooking(formData.airlineReturn1, formData.flightReturn1Departure, formData.flightReturn1Arrival, formData.flightReturn1Price, formData.flightReturn1Date, formData.flightReturn1Date);
    this.buildFlightBooking(formData.airlineReturn2, formData.flightReturn2Departure, formData.flightReturn2Arrival, formData.flightReturn2Price, formData.flightReturn2Date, formData.flightReturn2Date);
  }

  buildFlightBooking(airlineId, departure, arrival, price, departureDate, arrivalDate) {
    if (airlineId && departure && arrival) {
      var departureId = typeof departure === 'string' ? departure : departure.id;
      var arrivalId = typeof arrival === 'string' ? arrival : arrival.id;
      var airline = this.airlines.find(x => x.id == airlineId);
      var fee = price ? price : 0;
      this.flightFees.push({ 
        name: airline.name,
        price: fee
      });

      this._customer.flightBookings.push({
        price: fee,
        departureDate: departureDate,
        arrivalDate: arrivalDate,
        flight: {
          airline: { id: airlineId },
          airportFrom: departureId,
          airportTo: arrivalId
        }
      });
    }
  }

  emitChanges() {
    this.onChange.emit({
      flightBookings: this._customer.flightBookings,
      flightFees: this.flightFees,
    });
  }

  displayFn(val: Lookup) {
    if (typeof val === 'string') {
      var l = this.airports ? this.airports.find(a => a.id == val) : null;
      return l ? l.name : val;
    }
    return val ? val.name : val;
  }

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
