import { Customer } from './customer.model';
import { Travel } from '../travels/travel.model';
import { Payment } from '../payments/payment.model';
import { HotelReservation } from '../hotels/hotel-reservation.model';
import { FlightBooking } from '../airlines/flight-booking.model';

export class CustomerTravel {
    customer?: Customer;
    travel?: Travel;
    hotelBookings?: HotelReservation[]
    flightBookings?: FlightBooking[];
    payment?: Payment;
    additionalFeeIds?: string[];
}