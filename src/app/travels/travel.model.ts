import { Customer } from '../customers/customer.model';
import { HotelReservation } from '../hotels/hotel-reservation.model';
import { FlightBooking } from '../airlines/flight-booking.model';
import { Fee } from '../management/fees-management/fee.model';
import { PagingResponse } from '../core/models/paging';

export class Travel {
    id?: string;
    status?: string;
    travelTypeId?: number;
    name?: string;
    unitPrice?: number;
    revenues?: number;
    startDate?: Date;
    endDate?: Date;

    fees?: Fee[];
    hotelBookings?: HotelReservation[]
    flightBookings?: FlightBooking[];
    customers?: PagingResponse<Customer>;
}

export enum TravelType {
    Travel = 1,
    Hajj,
    Omra
}
