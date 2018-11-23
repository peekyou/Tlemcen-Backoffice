import { Address } from '../core/models/address.model';
import { Customer } from '../customers/customer.model';

export class Hotel {
    id?: string;
    name?: string;
    roomsCount?: number;
    pilgrimsCount?: number;
    email?: string;
    phone?: string;
    address?: Address;
    rooms?: HotelRoom[];
    expanded?: boolean;
}

export class HotelRoom {
    id?: string;
    number?: string;
    bedsNumber?: number;
    personsNumber?: number;
    customers?: Customer[];
}