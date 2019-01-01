import { Customer } from './customer.model';
import { HotelReservation } from '../hotels/hotel-reservation.model';
import { FlightBooking } from '../airlines/flight-booking.model';
import { Payment } from '../payments/payment.model';

export class CustomerDetail extends Customer {
    payments?: Payment[];
    additionalFeeIds?: string[];
    hotelBookings?: HotelReservation[];
    flightBookings?: FlightBooking[];

    constructor() {
        super();
        this.payments = [];
        this.hotelBookings = [];
        this.flightBookings = [];
        this.additionalFeeIds = [];
    }
}