import { Lookup } from './lookup.model';

export class Address {
    country?: Lookup;
    state?: string;
    city?: string;
    area?: string;
    postalCode?: string;
    addressLine1?: string;
    addressLine2?: string;

    constructor() {
        this.country = {};
    }
}