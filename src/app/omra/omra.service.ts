import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs'; 

import { Omra } from './omra.model';
import { TravelType, TravelStatus } from '../travels/travel.model';
import { AuthHttpService } from '../core/services/auth-http.service';
import { PagingResponse } from '../core/models/paging';
import { TravelService } from '../travels/travel.service';

@Injectable()
export class OmraService extends TravelService {
  
  constructor(http: AuthHttpService) {
    super(http);
  }
  
  getOmraList(status: TravelStatus, page: number, count: number): Observable<PagingResponse<Omra>> {
    return super.getTravels(status, page, count, TravelType.Omra);
  }

  getOmra(id: string, itemsCount: number): Observable<Omra> {
    return super.getTravel(id, itemsCount);
  }

  createOmra(omra: Omra): Observable<Omra> {
    omra.travelTypeId = TravelType.Omra;
    return super.createTravel(omra);
  }
  
  updateOmra(omra: Omra): Observable<Omra> {
    return super.updateTravel(omra);
  }
}

