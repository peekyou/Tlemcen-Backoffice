import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { RequestArgs } from "@angular/http/src/interfaces";
import { MatSnackBar } from '@angular/material';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpService } from './http.service';
import { TranslationService } from './translation.service';
import { ToasterService } from './toaster.service';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class AuthHttpService extends HttpService {

    constructor(
        http: HttpClient,
        translation: TranslationService,
        toasterService: ToasterService,
        private authenticationService: AuthService
    ) {
        super(http, translation, toasterService);
    }

    get(resource: string): Observable<any> {
        this.addAuthHeader();
        return super.get(resource);
    }

    getFile(resource: string): Observable<any> {
        this.addAuthHeader();
        return super.getFile(resource);
    }
    
    download(resource: string): Observable<any> {
        this.addAuthHeader();
        return super.download(resource)
            .pipe(catchError(this.showToaster(this.toasterService)));
    }

    post(resource: string, data: any): Observable<any> {
        this.addAuthHeader();
        return super.post(resource, data);
    }

    put(resource: string, data: any): Observable<any> {
        this.addAuthHeader();
        return super.put(resource, data);
    }

    delete(resource: string, data?: any): Observable<any> {
        this.addAuthHeader();
        return super.delete(resource, data);
    }

    private addAuthHeader() {
        if (this.authenticationService.isAuthenticated()) {
            this.headers['Authorization'] = 'Bearer ' + this.authenticationService.token;
        }
    }
}