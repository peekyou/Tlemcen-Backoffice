import { Customer } from '../customers/customer.model';

export class Payment {
    id?: string;
    status?: string;
    date?: Date;
    amount?: number;
    deposit?: number
    customer?: Customer;
}

