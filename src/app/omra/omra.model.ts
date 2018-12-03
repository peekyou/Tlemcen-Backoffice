import { Customer } from '../customers/customer.model';
import { HotelReservation } from '../hotels/hotel-reservation.model';
import { Airline } from '../airlines/airline.model';

export class Omra {
    id?: string;
    status?: string;
    name?: string;
    revenues?: number;

    reservations?: HotelReservation[]
    customers?: Customer[];
    airlines?: Airline[];
}