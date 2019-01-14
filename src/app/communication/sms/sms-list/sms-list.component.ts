import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { SmsService } from '../sms.service';
import { Campaign } from '../../campaign.model';
import { PagingResponse } from '../../../core/models/paging';

@Component({
  selector: 'app-sms-list',
  styleUrls: [ './sms-list.component.scss' ],
  templateUrl: './sms-list.component.html'
})
export class SmsListComponent implements OnInit {
  loader: Subscription;
  _reload: boolean;
  promotions: PagingResponse<Campaign>;
  currentPage: number = 1;
  @Input() itemsPerPage: number = 10;

  @Input() 
  set reload(reload: boolean) {
    this._reload = reload;
    if (this._reload) {
      this.getPromotionsPage();
      this._reload = false;
    }
  }
  get data(): boolean {
    return this._reload;
  }
  
  constructor(private service: SmsService) { }

  ngOnInit() {
    this.getPromotionsPage();
  }
  
  getPromotionsPage() {
    this.loader = this.service
      .getSmsCampaigns(this.currentPage, this.itemsPerPage)
      .subscribe(
        res => this.promotions = res,
        err => { console.log(err); }
      );
  }

  pageChanged(page) {
    this.currentPage = page;
    this.getPromotionsPage();
  }
}