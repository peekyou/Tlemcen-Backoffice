import { AppFile } from './file.model';

export class Document {
    id?: string;
    name?: string;
    mandatory?: boolean;
    file?: AppFile;
}