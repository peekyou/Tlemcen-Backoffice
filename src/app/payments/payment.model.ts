import { Customer } from '../customers/customer.model';

export class Payment {
    id?: string;
    status?: string;
    date?: Date;
    fees?: number;
    amountPaid?: number;
    discount?: number;
    deposit?: number
    customer?: Customer;
}

