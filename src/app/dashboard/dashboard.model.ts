import { Payment } from '../payments/payment.model';
import { FlightBooking } from '../airlines/flight-booking.model';
import { HotelReservation } from '../hotels/hotel-reservation.model';

export class Dashboard {
    customerCount?: CustomerCountModel;
    revenues?: RevenuesModel;
    incompletePaymentsCount?: number;
    dailyRevenues?: DailyRevenuesModel[];
    monthlyCustomerCount?: MonthlyCustomerCountModel[];
    flightsOnArrival?: FlightBooking[];
    flightsOnDeparture?: FlightBooking[];
    hotelBookings?: HotelReservation[];
    dayVariation: number;

    constructor() {
        this.customerCount = {};
        this.revenues = {};
        this.dailyRevenues = [];
        this.monthlyCustomerCount = [];
        this.flightsOnArrival = [];
        this.flightsOnDeparture = [];
        this.hotelBookings = [];
    }
}

export class CustomerCountModel {
    totalCount?: number;
    todayCount?: number;
}

export class RevenuesModel {
    yearRevenues?: number;
    variation?: number;
}

export class DailyRevenuesModel {
    date?: Date;
    revenues?: number;
}

export class MonthlyCustomerCountModel {
    customerCount?: number;
    monthOfYear?: number;
}