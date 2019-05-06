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
    travelName?: string;
    paymentTypeId?: string;

    // UI Properties
    isEdit?: boolean;

    constructor() {
        this.amount = 0;
        this.amountPaid = 0;
        this.discount = 0;
    }
}

export class PaymentType {
    id?: string;
    name?: string;
}