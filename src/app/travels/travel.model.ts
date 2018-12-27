import { Customer } from '../customers/customer.model';
import { HotelReservation } from '../hotels/hotel-reservation.model';
import { FlightBooking } from '../airlines/flight-booking.model';
import { Fee } from '../management/fees-management/fee.model';

export class Travel {
    id?: string;
    status?: string;
    travelTypeId?: number;
    name?: number;
    unitPrice?: number;
    revenues?: number;

    fees?: Fee[];
    hotelBookings?: HotelReservation[]
    customers?: Customer[];
    flightBookings?: FlightBooking[];
}

export enum TravelType {
    Travel = 1,
    Hajj,
    Omra
}
