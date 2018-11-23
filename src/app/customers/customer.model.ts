import { Address } from '../core/models/address.model';
import { AppFile } from '../core/models/file.model';

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

    constructor() {
        this.address = {};
        this.picture = {};
    }
}

