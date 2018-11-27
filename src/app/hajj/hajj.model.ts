import { Customer } from '../customers/customer.model';
import { Hotel } from '../hotels/hotel.model';
import { Airline } from '../airlines/airline.model';

export class Hajj {
    id?: string;
    status?: string;
    year?: number;
    revenues?: number;

    hotels?: Hotel[]
    customers?: Customer[];
    airlines?: Airline[];
}