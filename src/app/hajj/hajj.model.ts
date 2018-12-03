import { Customer } from '../customers/customer.model';
import { HotelReservation } from '../hotels/hotel-reservation.model';
import { Airline } from '../airlines/airline.model';

export class Hajj {
    id?: string;
    status?: string;
    year?: number;
    revenues?: number;

    reservations?: HotelReservation[]
    customers?: Customer[];
    airlines?: Airline[];
}