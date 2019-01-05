import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { HotelReservation } from '../hotels/hotel-reservation.model';
import { FlightBooking } from '../airlines/flight-booking.model';
import { CustomerCountModel, DailyRevenuesModel, MonthlyCustomerCountModel, RevenuesModel } from './dashboard.model';
import { SearchFilter } from '../core/models/search-filter.model';
import { AuthHttpService } from '../core/services/auth-http.service';

@Injectable()
export class DashboardService {
  resource = 'dashboard';

  constructor(private http: AuthHttpService) { }

  getCustomerCount(filter: SearchFilter): Observable<CustomerCountModel> {
    return this.http.post(this.resource + '/customers/count', filter);
  }
  
  getRevenuesAmount(filter: SearchFilter): Observable<RevenuesModel> {
    return this.http.post(this.resource + '/revenues/count', filter);
  }

  getIncompletePaymentsCount(): Observable<number> {
    return this.http.get(this.resource + '/payments/incomplete/count');
  }

  getDailyRevenues(filter: SearchFilter): Observable<DailyRevenuesModel[]> {
    return this.http.post(this.resource + '/revenues/daily', filter);
  }

  getMonthlyCustomerCount(filter: SearchFilter): Observable<MonthlyCustomerCountModel[]> {
    return this.http.post(this.resource + '/customers/monthly', filter);
  }

  getFlightsOnArrival(): Observable<FlightBooking[]> {
    return this.http.get(this.resource + '/flights/arrivals');
  }

  getFlightsOnDeparture(): Observable<FlightBooking[]> {
    return this.http.get(this.resource + '/flights/departures');
  }

  getHotelBookings(): Observable<HotelReservation[]> {
    return this.http.get(this.resource + '/hotels/bookings');
  }
}
