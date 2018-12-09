import { Injectable, Inject } from '@angular/core';

import { Fee } from './fee.model';

@Injectable()
export class FeeService {
    private api: string;

    users: Fee[] = [
        { id: '2', email: 'jeremie.paas@gmail.com', firstname: 'Jeremie', lastname: 'Paas', status: 'admin', username: 'jeremie', password: 'admin', permissions: [] },
        { id: '3', email: 'test@gmail.com', firstname: 'Test', lastname: 'Test', status: 'admin', username: 'test', password: 'admin', permissions: [] },
      ];

    constructor() {
        // this.api = config.ApiEndpoint + '/customers';
    }
}

