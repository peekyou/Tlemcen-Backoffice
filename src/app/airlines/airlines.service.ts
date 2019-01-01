import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Airline } from './airline.model';
import { Flight } from './flight.model';
import { FlightBooking } from './flight-booking.model';
import { AuthHttpService } from '../core/services/auth-http.service';
import { PagingResponse } from '../core/models/paging';

@Injectable()
export class AirlinesService {
  resource = 'airlines';
    
  // airlines: Airline[] = [
  //   { id: '1', name: 'Saudi Airlines' },
  // ];

  constructor(private http: AuthHttpService) { }

  getAirlines(page: number, count: number): Observable<PagingResponse<Airline>> {
    return this.http.get(this.resource + '?pageNumber=' + page + '&itemsCount=' + count);
  }

  getFlights(page: number, count: number): Observable<PagingResponse<Flight>> {
    return this.http.get(this.resource + '?pageNumber=' + page + '&itemsCount=' + count);
  }

  getAirline(id): Observable<Airline> {
    return this.http.get(this.resource + '/' + id);
  }

  createAirline(airline: Airline) : Observable<Airline> {
    return this.http.post(this.resource, airline);
  }
  
  deleteAirline(id: string) : Observable<boolean> {
    return this.http.delete(this.resource + '/' + id);
  }
  
  bookFlights(travelId: string, flightBookings: FlightBooking[]) : Observable<boolean> {
    return this.http.post(this.resource + '/flights/book', {
      travelId: travelId,
      flightBookings: flightBookings
    });
  }
}