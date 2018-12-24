import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppDocument } from './document.model';
import { PagingResponse } from '../../core/models/paging';
import { AuthHttpService } from '../../core/services/auth-http.service';

@Injectable()
export class DocumentService {
    resource = 'documents';

    // documents: AppDocument[] = [
    //     { id: '2', categories: ['Hajj', 'Omra'], name: "Passeport", mandatory: true, file: null },
    //     { id: '3', categories: ['Hajj', 'Omra'], name: "Vaccins", mandatory: true, file: null },
    //     { id: '4', categories: ['Hajj', 'Omra'], name: "Certificat scolaire", mandatory: false, file: null },
    //   ];

    constructor(private http: AuthHttpService) { }

    getDocuments(page: number, count: number): Observable<PagingResponse<AppDocument>> {
        return this.http.get(this.resource + '?pageNumber=' + page + '&itemsCount=' + count);
    }

    getDocumentsByCategory(category): Observable<AppDocument[]> {
        return this.http.get(this.resource + '/category/' + category)
        .pipe(map(documents => {
            documents.forEach(doc => {
                doc.file = null;
            });
            return documents;
        }));
    }

    getDocument(id): Observable<AppDocument> {
        return this.http.get(this.resource + '/' + id);
    }

    createDocument(document: AppDocument) : Observable<AppDocument> {
        return this.http.post(this.resource, document);
    }

    updateDocument(document: AppDocument): Observable<AppDocument> {
        return this.http.put(this.resource + '/' + document.id, document);
    }
    
    deleteDocument(id: string) : Observable<boolean> {
        return this.http.delete(this.resource + '/' + id);
    }
}