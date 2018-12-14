import { Customer } from '../customers/customer.model';
import { HotelReservation } from '../hotels/hotel-reservation.model';
import { Airline } from '../airlines/airline.model';
import { Fee } from '../management/fees-management/fee.model';

export class Omra {
    id?: string;
    status?: string;
    name?: string;
    revenues?: number;

    fees?: Fee[];
    reservations?: HotelReservation[]
    customers?: Customer[];
    airlines?: Airline[];
}