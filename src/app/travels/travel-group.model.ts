import { CustomerDetail } from '../customers/customer-detail.model';
import { Travel } from './travel.model';

export class TravelGroup {
    groupId?: string;
    customers?: CustomerDetail[];
    travel?: Travel;
}