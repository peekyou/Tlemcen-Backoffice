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

  updateHotel(hotel: Hotel) : Observable<Hotel> {
    return this.http.put(this.resource + '/' + hotel.id, hotel);
  }
  
  deleteHotel(id: string) : Observable<boolean> {
    return this.http.delete(this.resource + '/' + id);
  }

  saveHotelBooking(travelId: string, reservation: HotelReservation) : Observable<HotelReservation> {
    return this.http.post(this.resource + '/' + travelId + '/rooms', reservation);
  }

  updateHotelBooking(travelId: string, reservation: HotelReservation) : Observable<HotelReservation> {
    return this.http.put(this.resource + '/' + travelId + '/rooms', reservation);
  }

  deleteEmptyRooms(travelId) : Observable<HotelReservation> {
    return this.http.delete(this.resource + '/' + travelId + '/rooms');
  }
}
