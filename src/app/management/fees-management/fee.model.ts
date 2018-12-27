import { Category } from '../../core/models/category.model';

export class Fee {
    id?: string;
    name: string;
    price: number;
    categories?: Category[];
    isServiceFee?: boolean;

    constructor() {
        this.categories = [];
    }
}