export class AppFile {
    id?: string;
    name?: string;
    size?: number;
    createdDate?: Date;
    src?: string | ArrayBuffer;
    data?: any;
    mime?: string;
    
    constructor() {
    }
}