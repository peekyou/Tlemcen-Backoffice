import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';

import { User, Permission } from './user.model';

@Injectable()
export class UserService {
    private api: string;

    users: User[] = [
        { id: '2', email: 'jeremie.paas@gmail.com', firstname: 'Jeremie', lastname: 'Paas', status: 'admin', username: 'jeremie', password: 'admin', permissions: [] },
        { id: '3', email: 'test@gmail.com', firstname: 'Test', lastname: 'Test', status: 'admin', username: 'test', password: 'admin', permissions: [] },
      ];

    constructor() {
        // this.api = config.ApiEndpoint + '/customers';
    }

    getPermissions(): Observable<Permission[]> {
        return of([]);
    }

    saveUser(user: User): Observable<User> {
        if (!user.id) {
            user.id = new Date().getMilliseconds().toString();
        }
        return of(user);
    }
}