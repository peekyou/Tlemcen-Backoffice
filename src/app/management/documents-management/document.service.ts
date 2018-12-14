import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AppDocument } from './document.model';

@Injectable()
export class DocumentService {
    private api: string;

    documents: AppDocument[] = [
        { id: '2', categories: ['Hajj', 'Omra'], name: "Passeport", mandatory: true },
        { id: '3', categories: ['Hajj', 'Omra'], name: "Vaccins", mandatory: true },
        { id: '4', categories: ['Hajj', 'Omra'], name: "Certificat scolaire", mandatory: false },
      ];

    constructor() {
        // this.api = config.ApiEndpoint + '/customers';
    }

    create(document: AppDocument) : Observable<AppDocument> {
        document.id = new Date().getMilliseconds().toString();
        this.documents.push(document);
        return of(document);
    }

    delete(id: string) : Observable<boolean> {
        var index = this.documents.findIndex(x => x.id == id);
        this.documents.splice(index, 1);
        return of(true);
    }
}

