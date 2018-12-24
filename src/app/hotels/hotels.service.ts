import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Hotel } from './hotel.model';
import { HotelReservation } from './hotel-reservation.model';
import { HotelRoomReservation } from './hotel-room-reservation.model';
import { PagingResponse } from '../core/models/paging';
import { AuthHttpService } from '../core/services/auth-http.service';

@Injectable()
export class HotelsService {
  resource = 'hotels';

  // hotels: Hotel[] = [
  //   { id: '1', name: 'Jabal Omar Hyatt Regency', roomsCount: 111, phone: '+9667777777', address: {} },
  //   { id: '2', name: 'Sheraton Makkah Jabal Al Kaaba Hotel', roomsCount: 54, phone: '+96632243', address: {} },
  //   { id: '3', name: 'Hilton Makkah Convention Hotel', roomsCount: 64, phone: '+96621345', address: {} },
  //   { id: '4', name: 'Swissotel Al Maqam Makkah', roomsCount: 67, phone: '+966765321', address: {} },
  // ];

  constructor(private http: AuthHttpService) { }

  getHotels(page: number, count: number): Observable<PagingResponse<Hotel>> {
    return this.http.get(this.resource + '?pageNumber=' + page + '&itemsCount=' + count);
  }

  getHotel(id): Observable<Hotel> {
    return this.http.get(this.resource + '/' + id);
  }

  createHotel(hotel: Hotel) : Observable<Hotel> {
    return this.http.post(this.resource, hotel);
  }
  
  deleteHotel(id: string) : Observable<boolean> {
    return this.http.delete(this.resource + '/' + id);
  }

  saveHotelBooking(reservation: HotelReservation) : Observable<HotelReservation> {
    reservation.id = new Date().getMilliseconds().toString();
    reservation.hotel.expanded = true;
    return of(reservation);
  }

  createRoomsBooking(reservations: HotelRoomReservation[]) : Observable<HotelRoomReservation[]> {
    // reservation.id = new Date().getMilliseconds().toString();
    return of(reservations);
  }
}
