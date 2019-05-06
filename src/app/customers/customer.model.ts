import { Address } from '../core/models/address.model';
import { AppFile } from '../core/models/file.model';
import { Lookup } from '../core/models/lookup.model';
import { AppDocument } from '../management/documents-management/document.model';
import { Payment } from '../payments/payment.model';

export class Customer {
    id?: string;
    gender?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    birthDate?: Date;
    mobileNumber?: string;
    phoneNumber?: string;
    profession?: string;
    address?: Address;
    relationship?: string;
    nationality?: Lookup;
    passportNumber?: string;
    passportExpiryDate?: Date;
    passportIssuingCountry?: Lookup;
    birthCountry?: Lookup;
    howKnewAgency?: string;
    bloodGroup?: string;
    medicalInfo?: string;
    isConverted?: boolean;
    picture?: AppFile;
    documents?: CustomerDocument[];

    // For travel detail
    travelPayment?: Payment;
    travelGroupId?: string;
    
    // UI properties
    hovered?: boolean;

    // For room booking
    roomPrice?: number;

    constructor() {
        this.address = new Address();
        this.travelPayment = {};
        this.picture = null; // Set to null for upload component
		this.documents = [];
    }
}

export class CustomerDocument {
    id: string;
    documentTypeId: string;
    config: AppDocument;
}