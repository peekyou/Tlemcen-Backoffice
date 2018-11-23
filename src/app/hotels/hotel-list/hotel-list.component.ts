import { Component, OnInit } from '@angular/core';

import { HotelsService } from '../hotels.service';
import { Hotel } from '../hotel.model';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.scss']
})
export class HotelListComponent implements OnInit {
  hotels: Hotel[];

  constructor(private service: HotelsService) { 
    this.hotels = service.hotels;
  }

  ngOnInit() {
  }

  openHotelDialog(){
  }
}
