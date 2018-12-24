import { AppFile } from '../../core/models/file.model';
import { TravelType } from '../../travels/travel.model';

export class AppDocument {
    id: string;
    name: string;
    categories?: TravelType[];
    mandatory: boolean;
    file?: AppFile;

    constructor() {
        this.categories = [];
    }
}