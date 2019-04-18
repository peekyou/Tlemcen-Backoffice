import { Flight } from './flight.model';

export class ShuttleBus {
    id?: string;
    flightId?: string;
    price?: number;
    cityFrom?: string;
    cityTo?: string;
    departureDateTime?: Date;
    arrivalDateTime?: Date;
}