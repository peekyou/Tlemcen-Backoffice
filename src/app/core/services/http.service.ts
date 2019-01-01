import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { RequestArgs } from "@angular/http/src/interfaces";
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable()
export class HttpService {
    protected headers: any;
    public apiHost: string;

    constructor(private http: HttpClient) {
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        this.apiHost = environment.apiHost;
        if (!this.apiHost.endsWith('/')) {
            this.apiHost = this.apiHost + '/';
        }
    }

    get(resource: string): Observable<any> {
        return this.http.get(this.apiHost + resource, { headers: this.headers })
            .pipe(catchError(this.handleError));
    }

    getFile(resource: string): Observable<any> {
        return this.http.get(this.apiHost + resource, { 
                headers: this.headers,
                observe: 'response', 
                responseType: 'blob' 
            })
            .pipe(map(r => r.body, catchError(this.handleError)));
    }

    post(resource: string, data: any): Observable<any> {
        return this.http.post(this.apiHost + resource, JSON.stringify(data), { headers: this.headers })
            .pipe(catchError(this.handleError));
    }

    put(resource: string, data: any): Observable<any> {
        return this.http.put(this.apiHost + resource, JSON.stringify(data), { headers: this.headers })
            .pipe(catchError(this.handleError));
    }

    delete(resource: string, data?: any): Observable<any> {
        return this.http.request('DELETE', this.apiHost + resource, {
                headers: this.headers,
                body: data
            })
            .pipe(catchError(this.handleError));
    }
    
    protected handleError(error: any) {
        console.error(error);
        return throwError(error);
    }
}