import { Component, OnInit } from '@angular/core';

import { Airline } from '../airline.model';
import { AirlinesService } from '../airlines.service';

@Component({
  selector: 'app-airline-list',
  templateUrl: './airline-list.component.html',
  styleUrls: ['./airline-list.component.scss']
})
export class AirlineListComponent implements OnInit {
  airlines: Airline[];

  constructor(private service: AirlinesService) { 
    this.airlines = service.airlines
  }

  ngOnInit() {
  }

  openAirlineDialog(){
  }
}
