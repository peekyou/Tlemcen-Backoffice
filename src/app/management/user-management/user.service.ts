import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';

import { User, Role, Permission } from './user.model';
import { PagingResponse } from '../../core/models/paging';
import { AuthHttpService } from '../../core/services/auth-http.service';

@Injectable()
export class UserService {
    resource = 'users';

    constructor(private http: AuthHttpService) { }

    getUsers(page: number, count: number): Observable<PagingResponse<User>> {
        return this.http.get(this.resource + '?pageNumber=' + page + '&itemsCount=' + count);
    }

    createUser(user: User): Observable<User> {
        return this.http.post(this.resource, user);
    }

    updateUser(user: User): Observable<User> {
        return this.http.put(this.resource + '/' + user.id, user);
    }

    deleteUser(id: string) : Observable<boolean> {
        return this.http.delete(this.resource + '/' + id);
    }

    getRoles(): Observable<Role[]> {
        return this.http.get('roles');
    }
}