import { Flight } from './flight.model';
import { Customer } from '../customers/customer.model';

export class FlightBooking {
    id?: string;
    name?: string;
    reference?: string;
    flight?: Flight;
    price?: number;
    departureDate?: Date;
    arrivalDate?: Date;
    customers? : Customer[];
    displayOrder?: number;
    travelerCount?: number;
}