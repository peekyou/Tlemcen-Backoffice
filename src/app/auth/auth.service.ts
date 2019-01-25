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
    private permissions: string[];
    private roles: string[];
    private username: string;
    private userId: string;
    public token: string = null;
    
    constructor(private http: HttpService) {
        this.token = localStorage.getItem(this.tokenKey);
        this.setPermissions();
        this.setRoles();
    }

    login(username: string, password: string): Observable<boolean> {
      return this.http
        .post('login', { username: username, password: password })
        .pipe(map(token => {
            if (token) {
                this.token = token;
                localStorage.setItem(this.tokenKey, token);
                this.setPermissions();
                this.setRoles();
                return true;
            } else {
                return false;
            }
        }));
    }

    setPassword(password: string, token: string, code: string): Observable<void> {
        return this.http.put('password', { token: token, password: password, code: code });
    }

    forgetPassword(email: string): Observable<boolean> {
        return this.http.post('password/forget', email);
    }

    setRoles() {
        if (this.token) {
            var claims = parseJwt(this.token);
            this.roles = claims[Claims.Roles];
        }
        else {
            this.roles = [];
        }
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

    hasAnyPermission(permissions: string[]): boolean {
        if (!permissions || !this.permissions) {
            return false;
        }
        for (var i = 0; i < permissions.length; i++) {
            if (this.permissions.indexOf(permissions[i]) > -1) {
                return true;
            }
        }
        return false;
    }
    
    hasPermission(permission: string): boolean {
        if (!permission || !this.permissions) {
            return false;
        }
        return this.permissions.indexOf(permission) > -1;
    }
    
    isInRole(roles: string[]): boolean {
        if (!roles || !this.roles) {
            return false;
        }
        for (var i = 0; i < roles.length; i++) {
            if (this.roles.indexOf(roles[i]) > -1) {
                return true;
            }
        }
        return false;
    }
}