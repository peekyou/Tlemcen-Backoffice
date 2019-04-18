import { HotelRoomReservation } from './hotel-room-reservation.model';
import { Hotel } from './hotel.model';

export class HotelReservation {
    id?: string;
    hotel?: Hotel;
    fromDate?: Date;
    toDate?: Date;
    travelerCount?: number;
    rooms?: HotelRoomReservation[];

    constructor() {
        this.rooms = [];
    }

    static getAvailableSpace(reservation: HotelReservation): number {
        var availableSpace = 0;
        for (let i = 0; reservation.rooms && i < reservation.rooms.length; i++) {
            availableSpace += HotelRoomReservation.getAvailableSpace(reservation.rooms[i]);
        }
        return availableSpace;
    }
}