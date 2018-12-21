import { Injectable, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Http, Headers, Response } from '@angular/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpService } from '../core/services/http.service';
import { parseJwt } from '../core/helpers/utils';
import { Claims } from '../core/helpers/claims';

@Injectable()
export class AuthService {
    private tokenKey = 'token';
    private customFieldsKey = 'customfields';
    private api: string;
    private permissions: string[];
    private username: string;
    private userId: string;
    public token: string = null;
    
    constructor(private http: HttpService) {
        this.token = localStorage.getItem(this.tokenKey);
        this.setPermissions();
    }

    login(username: string, password: string): Observable<boolean> {
      return this.http
        .post('login', { username: username, password: password })
        .pipe(map(token => {
            if (token) {
                this.token = token;
                localStorage.setItem(this.tokenKey, token);
                this.setPermissions();
                return true;
            } else {
                return false;
            }
        }));
    }

    setPassword(password: string, token: string, code: string): Observable<boolean> {
      return of(true);
        // return this.http.put(this.api + '/users/password', { token: token, password: password, code: code });
    }

    forgetPassword(email: string): Observable<boolean> {
      return of(true);
        // return this.http.post(this.api + '/users/password/forget', { email: email, groupId: this.config.GroupId });
    }

    setPermissions() {
        if (this.token) {
            var claims = parseJwt(this.token);
            this.permissions = claims[Claims.Permissions];
        }
        else {
            this.permissions = [];
        }
    }

    logout(): void {
        this.token = null;
        this.userId = null;
        this.username = null;
        localStorage.removeItem(this.tokenKey);
    }

    isAuthenticated(): boolean {
        return this.token != null;
    }

    getUsername(): string {
        if (this.token && !this.username) {
            var claims = parseJwt(this.token);
            this.username = claims[Claims.Name];
        }
        return this.username;
    }

    getUserId(): string {
        if (this.token && !this.userId) {
            var claims = parseJwt(this.token);
            // this.userId = claims[Claims.Profile + '/UserId'];
        }
        return this.userId;
    }

    hasPermission(permission: string): boolean {
        if (!permission || !this.permissions) {
            return false;
        }
        return this.permissions.indexOf(permission) > -1;
    }
}