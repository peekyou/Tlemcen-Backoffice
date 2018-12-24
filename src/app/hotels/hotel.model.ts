import { Address } from '../core/models/address.model';
import { Customer } from '../customers/customer.model';

export class Hotel {
    id?: string;
    name?: string;
    roomsCount?: number;
    contactEmail?: string;
    contactPhoneNumber?: string;
    category?: string;
    address?: Address;
    expanded?: boolean;
}

export class HotelRoom {
    id?: string;
    number?: string;
    bedsNumber?: number;
    personsNumber?: number;
}