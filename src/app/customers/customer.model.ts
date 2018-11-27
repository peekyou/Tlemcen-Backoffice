import { Address } from '../core/models/address.model';
import { AppFile } from '../core/models/file.model';
import { Document } from '../core/models/document.model';

export class Customer {
    id?: string;
    gender?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    birthdate?: Date;
    mobileNumber?: string;
    address?: Address; 
    picture?: AppFile; 
    documents?: Document[]; 

    constructor() {
        this.address = {};
        this.picture = {};
		this.documents = [];
    }
}

