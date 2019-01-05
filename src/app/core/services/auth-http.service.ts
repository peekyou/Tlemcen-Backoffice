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
    protected notFoundMessage = '';
    protected errorMessage = '';

    constructor(
        http: HttpClient,
        private translation: TranslationService,
        private toasterService: ToasterService,
        private authenticationService: AuthService
    ) {
        super(http);

        this.translation
        .getMultiple(['ERRORS.SERVER_ERROR', 'ERRORS.NOT_FOUND'], x => {
            this.errorMessage = x['ERRORS.SERVER_ERROR'];
            this.notFoundMessage = x['ERRORS.NOT_FOUND'];
        }); 
    }

    get(resource: string): Observable<any> {
        this.addAuthHeader();
        return super.get(resource)
            .pipe(catchError(this.showToaster(this.toasterService)));
    }

    download(resource: string): Observable<any> {
        this.addAuthHeader();
        return super.download(resource);
    }

    post(resource: string, data: any): Observable<any> {
        this.addAuthHeader();
        return super.post(resource, data)
            .pipe(catchError(this.showToaster(this.toasterService)));
    }

    put(resource: string, data: any): Observable<any> {
        this.addAuthHeader();
        return super.put(resource, data)
            .pipe(catchError(this.showToaster(this.toasterService)));
    }

    delete(resource: string, data?: any): Observable<any> {
        this.addAuthHeader();
        return super.delete(resource, data)
        .pipe(catchError(this.showToaster(this.toasterService)));
    }

    private addAuthHeader() {
        if (this.authenticationService.isAuthenticated()) {
            this.headers['Authorization'] = 'Bearer ' + this.authenticationService.token;
        }
    }

    protected showToaster<T> (toasterService) {
        return (error: any): Observable<T> => {
            var message = error.status == 404 ? this.notFoundMessage : this.errorMessage;
            toasterService.showToaster(message, false);
            return throwError(error);
        };
    }
}