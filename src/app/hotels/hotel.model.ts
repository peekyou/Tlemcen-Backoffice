import { Address } from '../core/models/address.model';
import { Customer } from '../customers/customer.model';

export class Hotel {
    id?: string;
    name?: string;
    roomsCount?: number;
    contactEmail?: string;
    contactPhoneNumber?: string;
    category?: number;
    address?: Address;
    expanded?: boolean;

    constructor() {
        this.address = {};
    }
}

export class RoomType {
    id?: string;
    name?: string;
    number?: string;
    personNumber?: number;
}