import { Injectable, Inject } from '@angular/core';

import { Document } from './document.model';

@Injectable()
export class DocumentService {
    private api: string;

    users: User[] = [
        { id: '2', email: 'jeremie.paas@gmail.com', firstname: 'Jeremie', lastname: 'Paas', status: 'admin', username: 'jeremie', password: 'admin', permissions: [] },
        { id: '3', email: 'test@gmail.com', firstname: 'Test', lastname: 'Test', status: 'admin', username: 'test', password: 'admin', permissions: [] },
      ];

    constructor() {
        // this.api = config.ApiEndpoint + '/customers';
    }
}

