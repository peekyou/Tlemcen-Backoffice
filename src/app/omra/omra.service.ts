import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs'; 

import { Omra } from './omra.model';
import { TravelType } from '../travels/travel.model';
import { AuthHttpService } from '../core/services/auth-http.service';
import { PagingResponse } from '../core/models/paging';
import { TravelService } from '../travels/travel.service';

@Injectable()
export class OmraService extends TravelService {
  
  constructor(http: AuthHttpService) {
    super(http);
    this.resource = 'hajjs';
  }
  
  getOmraList(page: number, count: number): Observable<PagingResponse<Omra>> {
    return super.getTravels(page, count);
  }

  getOmra(id: string, itemsCount: number): Observable<Omra> {
    return super.getTravel(id, itemsCount);
  }

  createOmra(hajj: Omra): Observable<Omra> {
    hajj.travelTypeId = TravelType.Omra;
    return super.createTravel(hajj);
  }
  
  updateOmra(hajj: Omra): Observable<Omra> {
    return super.updateTravel(hajj);
  }
}

