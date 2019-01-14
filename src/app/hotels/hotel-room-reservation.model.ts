import { Customer } from '../customers/customer.model';
import { Hotel, RoomType } from './hotel.model';

export class HotelRoomReservation {
    id?: string;
    price?: number;
    hotel?: Hotel;
    roomType?: RoomType;
    customers?: Customer[];
    isValidated?: boolean;
    isSeparateBooking?: boolean;
    displayOrder?: number;
    fromDate?: Date;
    toDate?: Date;

    static getAvailableSpace(reservation: HotelRoomReservation): number {
        if (reservation && reservation.roomType) {
            return reservation.roomType.personNumber - reservation.customers.length;
        }
        return 0;
    }
}