import { Customer } from '../customers/customer.model';
import { HotelReservation } from '../hotels/hotel-reservation.model';
import { Airline } from '../airlines/airline.model';
import { Fee } from '../management/fees-management/fee.model';

export class Travel {
    id?: string;
    status?: string;
    travelTypeId?: number;
    name?: number;
    unitPrice?: number;
    revenues?: number;

    fees?: Fee[];
    reservations?: HotelReservation[]
    customers?: Customer[];
    airlines?: Airline[];
}

export enum TravelType {
    Travel = 1,
    Hajj,
    Omra
}
