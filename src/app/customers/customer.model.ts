import { Address } from '../core/models/address.model';
import { AppFile } from '../core/models/file.model';
import { Lookup } from '../core/models/lookup.model';
import { Document } from '../core/models/document.model';
import { Payment } from '../payments/payment.model';

export class Customer {
    id?: string;
    gender?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    birthdate?: Date;
    mobileNumber?: string;
    phoneNumber?: string;
    profession?: Lookup;
    address?: Address;
    relationship?: Lookup;
    nationality?: Lookup;
    passportNumber?: string;
    passportExpiryDate?: Date;
    birthCountry?: Lookup;
    howKnewAgency?: Lookup;
    picture?: AppFile;
    documents?: Document[]; 
    payments?: Payment[];

    constructor() {
        this.address = {};
        this.picture = {};
		this.documents = [];
		this.payments = [];
    }
}

