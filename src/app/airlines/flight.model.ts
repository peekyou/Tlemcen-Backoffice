import { Airline } from './airline.model';

export class Flight {
    id?: string;
    flightNumber?: string;
    aircraft?: string;
    airline?: Airline;
    passengerCount?: number;
}