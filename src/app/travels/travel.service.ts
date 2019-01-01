import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Travel } from './travel.model';
import { Customer } from '../customers/customer.model';
import { HotelReservation } from '../hotels/hotel-reservation.model';
import { FlightBooking } from '../airlines/flight-booking.model';
import { CustomerTravel } from '../customers/customer-travel.model';
import { AuthHttpService } from '../core/services/auth-http.service';
import { PagingResponse } from '../core/models/paging';

@Injectable()
export class TravelService {
  protected resource = 'travels';
  public travelWithCustomers: any;

  constructor(private http: AuthHttpService) { }

  getTravels(page: number, count: number): Observable<PagingResponse<Travel>> {
    return this.http.get(this.resource + '?pageNumber=' + page + '&itemsCount=' + count);
  }

  getAllTravels(page: number, count: number): Observable<PagingResponse<Travel>> {
    return this.http.get(this.resource + '/all?pageNumber=' + page + '&itemsCount=' + count);
  }

  getTravel(id, itemsCount: number): Observable<Travel> {
    return this.http.get(this.resource + '/' + id + '?itemsCount=' + itemsCount);
  }

  createTravel(travel: Travel): Observable<Travel> {
    return this.http.post(this.resource, travel);
  }

  deleteTravel(id: string) : Observable<boolean> {
    return this.http.delete(this.resource + '/' + id);
  }
  
  validateTravelers(travelId: string, customerIds: string[]): Observable<any[]> {
    return this.http.post(this.resource + '/travelers/validate', { travelId: travelId, entityIds: customerIds });
  }
  
  validateHotels(travelId: string, hotelIds: string[]): Observable<any[]> {
    return this.http.post(this.resource + '/hotels/validate', { travelId: travelId, entityIds: hotelIds });
  }

  getTravelers(travelId: string, page: number, count: number): Observable<PagingResponse<Travel>> {
    return this.http.get(this.resource + '/' + travelId + '/travelers?pageNumber=' + page + '&itemsCount=' + count);
  }

  getTraveler(travelId: string, travelerId: string): Observable<CustomerTravel> {
    return this.http.get(this.resource + '/' + travelId + '/travelers/' + travelerId);
  }

  addTravelers(customerTravel: CustomerTravel): Observable<boolean> {
    return this.http.post(this.resource + '/travelers', customerTravel);
  }
  
  updateTraveler(customerTravel: CustomerTravel): Observable<boolean> {
    return this.http.put(this.resource + '/travelers', customerTravel);
  }

  removeTravelers(travelId: string, customerIds: string[]): Observable<boolean> {
    return this.http.delete(this.resource + '/travelers', { travelId: travelId, entityIds: customerIds });
  }
  
  getHotelBookings(travelId: string): Observable<HotelReservation[]> {
    return this.http.get(this.resource + '/' + travelId + '/hotels/bookings');
  }

  getTravelersWithoutHotelBooking(travelId: string): Observable<Customer[]> {
    return this.http.get(this.resource + '/' + travelId + '/travelers/hotelbookingless');
  }

  getFlightBookings(travelId: string): Observable<FlightBooking[]> {
    return this.http.get(this.resource + '/' + travelId + '/flights/bookings');
  }
  
  downloadTravelerContract(travelId: string, travelerId: string): Observable<CustomerTravel> {
    return this.http.get(this.resource + '/' + travelId + '/travelers/' + travelerId + '/contract');
  }
}