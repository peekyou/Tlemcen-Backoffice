import { Customer } from '../customers/customer.model';

export class Payment {
    id?: string;
    status?: string;
    date?: Date;
    amount?: number;
    amountPaid?: number;
    discount?: number;
    customer?: Customer;
}

