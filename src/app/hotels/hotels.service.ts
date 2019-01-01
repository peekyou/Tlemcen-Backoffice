import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Hotel, RoomType } from './hotel.model';
import { HotelReservation } from './hotel-reservation.model';
import { HotelRoomReservation } from './hotel-room-reservation.model';
import { PagingResponse } from '../core/models/paging';
import { AuthHttpService } from '../core/services/auth-http.service';

@Injectable()
export class HotelsService {
  resource = 'hotels';

  constructor(private http: AuthHttpService) { }

  getHotels(page: number, count: number): Observable<PagingResponse<Hotel>> {
    return this.http.get(this.resource + '?pageNumber=' + page + '&itemsCount=' + count);
  }

  getRoomTypes(page: number, count: number): Observable<RoomType[]> {
    return this.http.get(this.resource + '/roomtypes');
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

  saveHotelBooking(travelId: string, reservation: HotelReservation) : Observable<HotelReservation> {
    return this.http.post(this.resource + '/rooms', {
      travelId: travelId,
      hotelBooking: reservation
    });
  }

  createRoomsBooking(reservations: HotelRoomReservation[]) : Observable<HotelRoomReservation[]> {
    // reservation.id = new Date().getMilliseconds().toString();
    return of(reservations);
  }
}
