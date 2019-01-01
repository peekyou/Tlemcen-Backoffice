import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs'; 

import { Omra } from './omra.model';
import { TravelType } from '../travels/travel.model';
import { AuthHttpService } from '../core/services/auth-http.service';
import { PagingResponse } from '../core/models/paging';

@Injectable()
export class OmraService {
  resource = 'omras';

  constructor(private http: AuthHttpService) { }
    
  getOmraList(page: number, count: number): Observable<PagingResponse<Omra>> {
    return this.http.get(this.resource + '?pageNumber=' + page + '&itemsCount=' + count);
  }

  getOmra(id): Observable<Omra> {
    return this.http.get(this.resource + '/' + id);
  }

  createOmra(omra: Omra): Observable<Omra> {
    omra.travelTypeId = TravelType.Omra;
    return this.http.post('travels', omra);
  }

  deleteOmra(id: string) : Observable<boolean> {
    return this.http.delete(this.resource + '/' + id);
  }
}

