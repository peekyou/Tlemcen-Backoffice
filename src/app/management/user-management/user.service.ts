import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';

import { User, Permission } from './user.model';
import { PagingResponse } from '../../core/models/paging';
import { AuthHttpService } from '../../core/services/auth-http.service';

@Injectable()
export class UserService {
    resource = 'users';

    users: User[] = [
        { id: '2', email: 'jeremie.paas@gmail.com', firstname: 'Jeremie', lastname: 'Paas', status: 'admin', username: 'jeremie', password: 'admin', permissions: [] },
        { id: '3', email: 'test@gmail.com', firstname: 'Test', lastname: 'Test', status: 'admin', username: 'test', password: 'admin', permissions: [] },
      ];

    constructor(private http: AuthHttpService) { }

    getUsers(page: number, count: number): Observable<PagingResponse<User>> {
        return this.http.get(this.resource + '?pageNumber=' + page + '&itemsCount=' + count);
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