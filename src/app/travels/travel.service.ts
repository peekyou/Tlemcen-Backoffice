import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Travel } from './travel.model';
import { Customer } from '../customers/customer.model';
import { HotelReservation } from '../hotels/hotel-reservation.model';
import { FlightBooking } from '../airlines/flight-booking.model';
import { CustomerTravel } from '../customers/customer-travel.model';
import { AuthHttpService } from '../core/services/auth-http.service';
import { PagingResponse } from '../core/models/paging';
import { Lookup } from '../core/models/lookup.model';

@Injectable()
export class TravelService {
  protected resource = 'travels';
  public travelWithCustomers: any;

  constructor(private http: AuthHttpService) { }

  getTravels(page: number, count: number): Observable<PagingResponse<Travel>> {
    return this.http.get(this.resource + '?pageNumber=' + page + '&itemsCount=' + count);
  }

  getTravelsAsLookup(): Observable<Lookup[]> {
    return this.http.get(this.resource + '/lookup');
  }

  getTravel(id, itemsCount: number): Observable<Travel> {
    return this.http.get(this.resource + '/' + id + '?itemsCount=' + itemsCount);
  }

  createTravel(travel: Travel): Observable<Travel> {
    return this.http.post(this.resource, travel);
  }
  
  updateTravel(travel: Travel): Observable<Travel> {
    return this.http.put(this.resource + '/' + travel.id, travel);
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

  getTraveler(travelId: string, travelerId: string, onlySeparateBooking: boolean = false): Observable<CustomerTravel> {
    return this.http.get(this.resource + '/' + travelId + '/travelers/' + travelerId + '?onlySeparateBooking=' + onlySeparateBooking);
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
  
  removeHotelBooking(travelId: string, booking: HotelReservation): Observable<boolean> {
    return this.http.delete(this.resource + '/' + travelId + '/hotels/bookings/' + booking.id);
  }
  
  removeFlightBooking(travelId: string, booking: FlightBooking): Observable<boolean> {
    return this.http.delete(this.resource + '/' + travelId + '/flights/bookings/' + booking.id);
  }
  
  getHotelBookings(travelId: string): Observable<HotelReservation[]> {
    return this.http.get(this.resource + '/' + travelId + '/hotels/bookings');
  }

  getTravelersWithoutHotelBooking(travelId: string): Observable<any> {
    return this.http.get(this.resource + '/' + travelId + '/travelers/hotelbookingless');
  }

  getFlightBookings(travelId: string): Observable<FlightBooking[]> {
    return this.http.get(this.resource + '/' + travelId + '/flights/bookings');
  }

  saveHotelsPlan(travelId: string, bookings: HotelReservation[]): Observable<boolean> {
    return this.http.post(this.resource + '/' + travelId + '/hotels/plan', {
      hotelBooking: bookings
    });
  }
  
  downloadTravelerContract(travelId: string, travelerId: string): Observable<void> {
    return this.http.download(this.resource + '/' + travelId + '/travelers/' + travelerId + '/contract');
  }
  
  downloadPaymentReceipt(travelId: string, travelerId: string): Observable<void> {
    return this.http.download(this.resource + '/' + travelId + '/travelers/' + travelerId + '/receipt');
  }

  downloadTravelerBadge(travelId: string, travelerId: string): Observable<void> {
    return this.http.download(this.resource + '/' + travelId + '/travelers/' + travelerId + '/badge');
  }

  downloadAllBadges(travelId: string): Observable<void> {
    return this.http.download(this.resource + '/' + travelId + '/travelers/badges');
  }
  
  downloadInhumationAuthorization(travelId: string, travelerId: string): Observable<CustomerTravel> {
    return this.http.download(this.resource + '/' + travelId + '/travelers/' + travelerId + '/inhumation');
  }

  downloadAirlineFile(travelId: string, airlineId: string): Observable<CustomerTravel> {
    return this.http.download(this.resource + '/' + travelId + '/airlines/' + airlineId + '/file');
  }
}