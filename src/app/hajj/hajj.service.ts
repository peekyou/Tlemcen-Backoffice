import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Hajj } from './hajj.model';
import { AuthHttpService } from '../core/services/auth-http.service';
import { PagingResponse } from '../core/models/paging';

@Injectable()
export class HajjService {
  resource = 'hajjs';

  constructor(private http: AuthHttpService) { }

  getHajjList(page: number, count: number): Observable<PagingResponse<Hajj>> {
    return this.http.get(this.resource + '?pageNumber=' + page + '&itemsCount=' + count);
  }

  getHajj(id): Observable<Hajj> {
    return this.http.get(this.resource + '/' + id);
  }

  createHajj(hajj: Hajj): Observable<Hajj> {
    return this.http.post(this.resource, hajj);
  }

  deleteHajj(id: string) : Observable<boolean> {
    return this.http.delete(this.resource + '/' + id);
  }
}

