import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Hajj } from './hajj.model';
import { TravelType, TravelStatus } from '../travels/travel.model';
import { TravelService } from '../travels/travel.service';
import { AuthHttpService } from '../core/services/auth-http.service';
import { PagingResponse } from '../core/models/paging';

@Injectable()
export class HajjService extends TravelService {

  constructor(http: AuthHttpService) {
    super(http);
    this.resource = 'hajjs';
  }

  getHajjList(status: TravelStatus, page: number, count: number): Observable<PagingResponse<Hajj>> {
    return super.getTravels(status, page, count);
  }

  getHajj(id: string, itemsCount: number): Observable<Hajj> {
    return super.getTravel(id, itemsCount);
  }

  createHajj(hajj: Hajj): Observable<Hajj> {
    hajj.travelTypeId = TravelType.Hajj;
    return super.createTravel(hajj);
  }
  
  updateHajj(hajj: Hajj): Observable<Hajj> {
    return super.updateTravel(hajj);
  }
}