import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Travel } from './travel.model';
import { AuthHttpService } from '../core/services/auth-http.service';
import { PagingResponse } from '../core/models/paging';

@Injectable()
export class TravelService {
  resource = 'travels';

  constructor(private http: AuthHttpService) { }

  getTravels(page: number, count: number): Observable<PagingResponse<Travel>> {
    return this.http.get(this.resource + '?pageNumber=' + page + '&itemsCount=' + count);
  }

  getAllTravels(page: number, count: number): Observable<PagingResponse<Travel>> {
    return this.http.get(this.resource + '/all?pageNumber=' + page + '&itemsCount=' + count);
  }

  getTravel(id): Observable<Travel> {
    return this.http.get(this.resource + '/' + id);
  }

  createTravel(hajj: Travel): Observable<Travel> {
    return this.http.post(this.resource, hajj);
  }

  deleteTravel(id: string) : Observable<boolean> {
    return this.http.delete(this.resource + '/' + id);
  }
}