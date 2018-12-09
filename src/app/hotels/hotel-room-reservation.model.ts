import { Customer } from '../customers/customer.model';
import { Hotel, HotelRoom } from './hotel.model';

export class HotelRoomReservation {
    id?: string;
    hotel?: Hotel;
    roomDetail?: HotelRoom;
    customers?: Customer[];

    static getAvailableSpace(reservation: HotelRoomReservation): number {
        if (reservation && reservation.roomDetail) {
            return reservation.roomDetail.personsNumber - reservation.customers.length;
        }
        return 0;
    }
}