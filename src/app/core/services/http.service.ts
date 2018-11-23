﻿import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { RequestArgs } from "@angular/http/src/interfaces";
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class HttpService {
    protected headers: any;

    constructor(private http: HttpClient) {
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    get(url: string): Observable<any> {
        return this.http.get(url, { headers: this.headers })
            .pipe(catchError(this.handleError));
    }

    post(url: string, data: any): Observable<any> {
        return this.http.post(url, JSON.stringify(data), { headers: this.headers })
            .pipe(catchError(this.handleError));
    }

    put(url: string, data: any): Observable<any> {
        return this.http.put(url, JSON.stringify(data), { headers: this.headers })
            .pipe(catchError(this.handleError));
    }

    delete(url: string, data?: any): Observable<any> {
        return this.http.delete(url, { headers: this.headers })
            .pipe(catchError(this.handleError));
    }

    private handleError(error: any) {
        console.error(error);
        return Observable.throw(error);

        //return Observable.throw(error.json().error || 'Server error');
        
        // The following doesn't work.
        // There's no error status at least in case of network errors.
        // WHY?!
        //
        // if ( error === undefined) error = null;
        // let errMsg = (error && error.message)
        //     ? error.message
        //     : (error && error.status)
        //         ? `${error.status} - ${error.statusText}`
        //         : error;
        //
        // return Observable.throw(errMsg);
    }
}