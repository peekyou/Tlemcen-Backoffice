import { HotelRoomReservation } from './hotel-room-reservation.model';
import { Hotel } from './hotel.model';

export class HotelReservation {
    id?: string;
    hotel?: Hotel;
    travelerCount?: number;
    rooms?: HotelRoomReservation[];

    constructor() {
		  this.rooms = [];
    }
}