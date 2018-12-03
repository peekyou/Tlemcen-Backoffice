import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Hotel } from './hotel.model';
import { HotelReservation } from './hotel-reservation.model';
import { HotelRoomReservation } from './hotel-room-reservation.model';

@Injectable()
export class HotelsService {

  hotels: Hotel[] = [
    { id: '1', name: 'Jabal Omar Hyatt Regency', roomsCount: 111, phone: '+9667777777', address: {} },
    { id: '2', name: 'Sheraton Makkah Jabal Al Kaaba Hotel', roomsCount: 54, phone: '+96632243', address: {} },
    { id: '3', name: 'Hilton Makkah Convention Hotel', roomsCount: 64, phone: '+96621345', address: {} },
    { id: '4', name: 'Swissotel Al Maqam Makkah', roomsCount: 67, phone: '+966765321', address: {} },
  ];

  constructor() { }

  create(hotel: Hotel) : Observable<Hotel> {
    hotel.id = new Date().getMilliseconds().toString();
    this.hotels.unshift(hotel);
    return of(hotel);
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
