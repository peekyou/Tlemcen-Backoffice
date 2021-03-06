import { Category } from '../../core/models/category.model';

export class Fee {
    id?: string;
    name: string;
    price: number;
    categories?: Category[];
    isDynamic?: boolean;
    isServiceFee?: boolean;
    isMandatoryFee?: boolean;

    // UI Properties
    checked?: boolean = false

    constructor() {
        this.categories = [];
    }
}