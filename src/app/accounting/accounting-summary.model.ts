import { Expense } from './expense.model';

export class AccountingSummary {
    id?: string;
    name?: string;
    status?: string;
    details?: string;
    revenues?: number;
    totalExpenses?: number;
    expenses?: Expense[];
}