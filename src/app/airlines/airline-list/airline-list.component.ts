import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { PagingResponse } from '../../core/models/paging';
import { Airline } from '../airline.model';
import { AirlinesService } from '../airlines.service';

@Component({
  selector: 'app-airline-list',
  templateUrl: './airline-list.component.html',
  styleUrls: ['./airline-list.component.scss']
})
export class AirlineListComponent implements OnInit {
  loader: Subscription;
  currentPage: number = 1;
  itemsPerPage: number = 20;
  airlines: PagingResponse<Airline>;

  constructor(private service: AirlinesService) {
    this.getAirlines();
  }

  ngOnInit() {
  }

  getAirlines() {
    window.scroll(0,0);

    this.loader = this.service.getAirlines(this.currentPage, this.itemsPerPage)
    .subscribe(
      res => this.airlines = res,
      err => console.log(err)
    );
}

  pageChanged(page) {
    this.currentPage = page;
    this.getAirlines();
  }

  openAirlineDialog(){
  }
}
