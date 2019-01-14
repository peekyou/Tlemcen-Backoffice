import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Campaign, CampaignFilter } from '../campaign.model';
import { AuthHttpService } from '../../core/services/auth-http.service';
import { PagingResponse } from '../../core/models/paging';
import { SmsPack } from './sms-pack.model';

@Injectable()
export class SmsService {
  resource = 'sms';
  public nbRecipients: number;

  constructor(private http: AuthHttpService) { }

  getSmsCampaigns(page: number, count: number): Observable<PagingResponse<Campaign>> {
    return this.http.get(this.resource + '/campaigns?pageNumber=' + page + '&itemsCount=' + count);
  }

  getAllSmsCampaigns(): Observable<PagingResponse<Campaign>> {
      return this.http.get(this.resource);
  }

  createCampaign(campaign: Campaign): Observable<Campaign> {
      return this.http.post(this.resource + '/campaigns', campaign);
  }

  customerCount(filter: CampaignFilter): Observable<number> {
      return this.http.post(this.resource + '/campaigns/target', filter);
  }
  
  getSmsPack(): Observable<SmsPack> {
    return this.http.get(this.resource + '/pack');
  }

  buyPack(packNumber: number): Observable<number> {
    return this.http.post(this.resource + '/pack', packNumber);
  }
}