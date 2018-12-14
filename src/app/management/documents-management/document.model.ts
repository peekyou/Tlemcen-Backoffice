import { AppFile } from '../../core/models/file.model';

export class AppDocument {
    id: string;
    name: string;
    categories?: string[];
    mandatory: boolean;
    file?: AppFile;
}