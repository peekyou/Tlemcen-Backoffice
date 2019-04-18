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
    travelerCount?: number;

    fees?: Fee[];
    hotelBookings?: HotelReservation[]
    flightBookings?: FlightBooking[];
    travelGuides?: TravelGuide[];
    customers?: PagingResponse<Customer>;

    constructor() {
        this.fees = [];
        this.hotelBookings = [];
        this.flightBookings = [];
        this.travelGuides = [];
    }
}

export enum TravelType {
    Travel = 1,
    Hajj,
    Omra
}

export class TravelGuide {
    id?: string;
    firstname?: string;
    lastname?: string;
    birthDate?: Date;
    email?: string;
    mobileNumber?: string;
}

export enum TravelStatus {
    All = 1,
    Completed,
    NotCompleted
}