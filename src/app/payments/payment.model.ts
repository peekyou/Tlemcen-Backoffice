import { Customer } from '../customers/customer.model';

export class Payment {
    id?: string;
    status?: string;
    createdDate?: Date;
    amount?: number;
    amountPaid?: number;
    discount?: number;
    customer?: Customer;
    travelId?: string;

    constructor() {
        this.amount = 0;
        this.amountPaid = 0;
        this.discount = 0;
    }
}