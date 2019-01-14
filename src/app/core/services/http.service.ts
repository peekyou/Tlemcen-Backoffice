import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { RequestArgs } from "@angular/http/src/interfaces";
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { environment } from '../../../environments/environment';
import { TranslationService } from '../services/translation.service';
import { ToasterService } from './toaster.service';
import { ToasterType } from '../models/toaster-type';

@Injectable()
export class HttpService {
    protected headers: any;
    public apiHost: string;
    
    protected notFoundMessage = '';
    protected errorMessage = '';

    constructor(protected http: HttpClient, protected translation: TranslationService, protected toasterService: ToasterService) {
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        this.apiHost = environment.apiHost;
        if (!this.apiHost.endsWith('/')) {
            this.apiHost = this.apiHost + '/';
        }

        this.translation
            .getMultiple(['ERRORS.SERVER_ERROR', 'ERRORS.NOT_FOUND'], x => {
                this.errorMessage = x['ERRORS.SERVER_ERROR'];
                this.notFoundMessage = x['ERRORS.NOT_FOUND'];
            }); 
    }

    get(resource: string): Observable<any> {
        return this.http.get(this.apiHost + resource, { headers: this.headers })
        .pipe(catchError(this.showToaster(this.toasterService)));
    }

    getFile(resource: string): Observable<any> {
        return this.http.get(this.apiHost + resource, { 
                headers: this.headers,
                observe: 'response', 
                responseType: 'blob' 
            })
            .pipe(map(r => r.body, catchError(this.showToaster(this.toasterService))));
    }
    
    download(resource: string): Observable<any> {
        return this.http.get(this.apiHost + resource, { 
                headers: this.headers,
                observe: 'response', 
                responseType: 'blob' 
            })
            .pipe(map(res => {
                var fileName: string = null;
                var contentDisposition = res.headers.get('Content-Disposition');
                if (contentDisposition) {
                    fileName = contentDisposition.split('=')[1];
                }
                return saveAs(res.body, fileName);
            }, catchError(this.showToaster(this.toasterService))));
    }

    post(resource: string, data: any): Observable<any> {
        return this.http.post(this.apiHost + resource, JSON.stringify(data), { headers: this.headers })
            .pipe(catchError(this.showToaster(this.toasterService)));
    }

    put(resource: string, data: any): Observable<any> {
        return this.http.put(this.apiHost + resource, JSON.stringify(data), { headers: this.headers })
            .pipe(catchError(this.showToaster(this.toasterService)));
    }

    delete(resource: string, data?: any): Observable<any> {
        return this.http.request('DELETE', this.apiHost + resource, {
                headers: this.headers,
                body: data
            })
            .pipe(catchError(this.showToaster(this.toasterService)));
    }
    
    protected showToaster<T> (toasterService) {
        return (ex: any): Observable<T> => {
            console.error(ex);
            if (ex.error instanceof Blob) {
                const reader = new FileReader();
                reader.addEventListener('loadend', (e) => {
                    const text = (<any>e.srcElement).result;
                    if (text) {
                        var ob = JSON.parse(text);
                        if (ob && ob.exceptionMessage) {
                            this.showWarningMessage(ob.exceptionMessage);
                        }
                    }
                });
                reader.readAsText(ex.error);
            }
            else {
                if (ex.error && ex.error.exceptionMessage) {
                    this.showWarningMessage(ex.error.exceptionMessage);
                }
                else {
                    var message = ex.status == 404 ? this.notFoundMessage : this.errorMessage;
                    toasterService.showToaster(message, ToasterType.Error);
                }
            }
            return throwError(ex);
        };
    }

    protected showWarningMessage(messageKey: string) {
        this.translation.get('ERRORS.' + messageKey, message => {
            this.toasterService.showToaster(message, ToasterType.Warning);
        });
    }

    // protected handleError(error: any) {
    //     console.error(error);
    //     return throwError(error);
    // }
}