import { Component, OnInit, Inject, Input, EventEmitter, Output } from '@angular/core';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AirlinesService } from '../../../airlines/airlines.service';
import { Fee } from '../../../management/fees-management/fee.model';
import { FlightBooking } from '../../../airlines/flight-booking.model';
import { ShuttleBus } from '../../../airlines/shuttle-bus.model';
import { Airline } from '../../../airlines/airline.model';
import { validateDate, filterLookup, dateToUTC } from '../../../core/helpers/utils';
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
  shuttles: ShuttleBus[] = [];
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
    if (this.form && !this.isGroup) {
      this.form.reset();
    }  
  }
  get customer(): CustomerDetail {
      return this._customer;
  }

  @Input() dialog: boolean = false;
  @Input() isGroup = false;
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

      hasTransfer: this.fb.control(null),
      returnHasTransfer: this.fb.control(null),

      hasBusTransferDeparture: this.fb.control(null),
      busTransferDeparture: this.fb.control(null),
      hasBusTransferArrival: this.fb.control(null),
      busTransferArrival: this.fb.control(null),
      busTransferArrivalDate: this.fb.control(null),
      returnHasBusTransferDeparture: this.fb.control(null),
      returnBusTransferDeparture: this.fb.control(null),
      returnHasBusTransferArrival: this.fb.control(null),
      returnBusTransferArrival: this.fb.control(null),
      returnBusTransferArrivalDate: this.fb.control(null),
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
        map(option => option && option.length > 2 ? filterLookup(option, this.airports, true) : [])
    );
    
    this.filteredAirports2 = this.flightOneWay1Arrival.valueChanges
    .pipe(
        startWith(''),
        debounceTime(200),
        distinctUntilChanged(),
        map(option => option && option.length > 2 ? filterLookup(option, this.airports, true) : [])
    );

    this.filteredAirports3 = this.flightOneWay2Departure.valueChanges
    .pipe(
        startWith(''),
        debounceTime(200),
        distinctUntilChanged(),
        map(option => option && option.length > 2 ? filterLookup(option, this.airports, true) : [])
    );

    this.filteredAirports4 = this.flightOneWay2Arrival.valueChanges
    .pipe(
        startWith(''),
        debounceTime(200),
        distinctUntilChanged(),
        map(option => option && option.length > 2 ? filterLookup(option, this.airports, true) : [])
    );

    this.filteredAirports5 = this.flightReturn1Departure.valueChanges
    .pipe(
        startWith(''),
        debounceTime(200),
        distinctUntilChanged(),
        map(option => option && option.length > 2 ? filterLookup(option, this.airports, true) : [])
    );

    this.filteredAirports6 = this.flightReturn1Arrival.valueChanges
    .pipe(
        startWith(''),
        debounceTime(200),
        distinctUntilChanged(),
        map(option => option && option.length > 2 ? filterLookup(option, this.airports, true) : [])
    );

    this.filteredAirports7 = this.flightReturn2Departure.valueChanges
    .pipe(
        startWith(''),
        debounceTime(200),
        distinctUntilChanged(),
        map(option => option && option.length > 2 ? filterLookup(option, this.airports, true) : [])
    );

    this.filteredAirports8 = this.flightReturn2Arrival.valueChanges
    .pipe(
        startWith(''),
        debounceTime(200),
        distinctUntilChanged(),
        map(option => option && option.length > 2 ? filterLookup(option, this.airports, true) : [])
    );
  }

  setFlightsFees(formData) {
    this.flightFees = [];
    this._customer.flightBookings = [];
    this.shuttles = [];

    this.buildFlightBooking(formData.airlineOneWay1, formData.flightOneWay1Departure, formData.flightOneWay1Arrival, formData.flightOneWay1Price, formData.flightOneWay1Date, formData.flightOneWay1Date);
    if (formData.hasTransfer == true) {
      this.buildFlightBooking(formData.airlineOneWay2, formData.flightOneWay2Departure, formData.flightOneWay2Arrival, formData.flightOneWay2Price, formData.flightOneWay2Date, formData.flightOneWay2Date);
    }
    this.buildFlightBooking(formData.airlineReturn1, formData.flightReturn1Departure, formData.flightReturn1Arrival, formData.flightReturn1Price, formData.flightReturn1Date, formData.flightReturn1Date);
    if (formData.returnHasTransfer == true) {
      this.buildFlightBooking(formData.airlineReturn2, formData.flightReturn2Departure, formData.flightReturn2Arrival, formData.flightReturn2Price, formData.flightReturn2Date, formData.flightReturn2Date);
    }
    this.buildShuttles(formData);
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
        departureDate: dateToUTC(departureDate),
        arrivalDate: dateToUTC(arrivalDate),
        flight: {
          airline: { id: airlineId },
          airportFrom: departureId,
          airportTo: arrivalId
        }
      });
    }
  }

  buildShuttles(formData) {
    if (formData.hasBusTransferDeparture && formData.airlineOneWay1, formData.flightOneWay1Departure) {
      var airportFrom = typeof formData.flightOneWay1Departure === 'string' ? formData.flightOneWay1Departure : formData.flightOneWay1Departure ? formData.flightOneWay1Departure.id : null;
      this.shuttles.push({
        cityFrom: formData.busTransferDeparture,
        cityTo: airportFrom
      });
    }
    if (formData.hasBusTransferArrival) {
      var flight = formData.flightOneWay1Arrival;
      if (formData.hasTransfer && formData.airlineOneWay2 && formData.flightOneWay2Arrival) {
        flight = formData.flightOneWay2Arrival;
      }
      var airportTo = typeof flight === 'string' ? flight : flight ? flight.id : null;
      this.shuttles.push({
        cityFrom: airportTo,
        cityTo: formData.busTransferArrival,
        departureDateTime: dateToUTC(formData.busTransferArrivalDate)
      });
    }

    if (formData.returnHasBusTransferDeparture && formData.airlineReturn1, formData.flightReturn1Departure) {
      var airportFrom = typeof formData.flightReturn1Departure === 'string' ? formData.flightReturn1Departure : formData.flightReturn1Departure ?formData.flightReturn1Departure.id : null;
      this.shuttles.push({
        cityFrom: formData.returnBusTransferDeparture,
        cityTo: airportFrom
      });
    }
    if (formData.returnHasBusTransferArrival) {
      var flight = formData.flightReturn1Arrival;
      if (formData.hasTransfer && formData.airlineReturn2 && formData.flightReturn2Arrival) {
        flight = formData.flightReturn2Arrival;
      }
      var airportTo = typeof flight === 'string' ? flight : flight ? flight.id : null;
      this.shuttles.push({
        cityFrom: airportTo,
        cityTo: formData.returnBusTransferArrival,
        departureDateTime: dateToUTC(formData.returnBusTransferArrivalDate)
      });
    }
  }

  emitChanges() {
    this.onChange.emit({
      flightBookings: this._customer.flightBookings,
      flightFees: this.flightFees,
      shuttles: this.shuttles
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

  get hasTransfer() { return this.form.get('hasTransfer'); }
  get returnHasTransfer() { return this.form.get('returnHasTransfer'); }
  get hasBusTransferDeparture() { return this.form.get('hasBusTransferDeparture'); }
  get hasBusTransferArrival() { return this.form.get('hasBusTransferArrival'); }
  get returnHasBusTransferDeparture() { return this.form.get('returnHasBusTransferDeparture'); }
  get returnHasBusTransferArrival() { return this.form.get('returnHasBusTransferArrival'); }
}
