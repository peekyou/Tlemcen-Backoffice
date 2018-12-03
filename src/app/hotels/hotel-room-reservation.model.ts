import { Customer } from '../customers/customer.model';
import { Hotel, HotelRoom } from './hotel.model';

export class HotelRoomReservation {
    id?: string;
    hotel?: Hotel;
    roomDetail?: HotelRoom;
    customers?: Customer[];
}