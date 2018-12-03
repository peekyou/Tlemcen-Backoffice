import { Injectable, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Http, Headers, Response } from '@angular/http';
import { Observable, of } from 'rxjs';

import { parseJwt } from '../core/helpers/utils';

@Injectable()
export class AuthService {
    private tokenKey = 'token';
    private customFieldsKey = 'customfields';
    private api: string;
    private permissions: string[];
    private username: string;
    private userId: string;
    public token: string = null;
    
    constructor() {
        this.token = localStorage.getItem(this.tokenKey);
        // this.setPermissions();
        this.logout();
    }

    login(username: string, password: string): Observable<boolean> {
      // return this.http
      // .post(this.api + '/login', { username: username, password: password, userType: 'merchant', groupId: this.config.GroupId })
      // .map((response: any) => {
      //     // login successful if there's a jwt token in the response
      //     let token = response.token; 
      //     if (token) {
      //         this.token = token;
      //         localStorage.setItem(this.tokenKey, token);
      //         this.setPermissions();
      //         this.setCustomerCustomFields();
      //         return true;
      //     } else {
      //         return false;
      //     }
      // });
      this.token = 'test.test.test';
      localStorage.setItem(this.tokenKey, this.token);
      return of(true);
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
            // this.permissions = claims[Claims.Permissions];
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
            // this.username = claims[Claims.Name];
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