import { AppFile } from '../core/models/file.model';

export class Expense {
    id?: string;
    title?: string;
    status?: string;
    details?: string;
    amount?: number;
    date?: Date;
    paymentTypeId?: number;
    attachments?: AppFile[];
    category?: ExpenseCategory;
    subcategory?: ExpenseCategory;
    hasFile?: boolean;

    constructor() {
        this.attachments = [];
    }
}

export class ExpenseCategory {
    id?: number;
    parentId?: number;    
    name?: string;
    subcategories?: ExpenseCategory[];

    // ui properties
    expanded?: boolean;

    constructor() {
        this.subcategories = [];
    }
}