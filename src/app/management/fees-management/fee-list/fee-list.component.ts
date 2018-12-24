import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';

import { ServiceFeeDialogComponent } from '../service-fee-dialog/service-fee-dialog.component';
import { TravelService } from '../../../travels/travel.service';
import { HotelsService } from '../../../hotels/hotels.service';
import { AirlinesService } from '../../../airlines/airlines.service';
import { FeeService } from '../fee.service';
import { Fee } from '../fee.model';
import { PagingResponse } from '../../../core/models/paging';
import { Category } from '../../../core/models/category.model';
import { Travel } from '../../../travels/travel.model';
import { Flight } from '../../../airlines/flight.model';
import { Hotel } from '../../../hotels/hotel.model';

@Component({
  selector: 'app-fee-list',
  templateUrl: './fee-list.component.html',
  styleUrls: ['./fee-list.component.scss']
})
export class FeeListComponent implements OnInit {
  loader: Subscription;
  hotelsCurrentPage: number = 1;
  travelsCurrentPage: number = 1;
  flightsCurrentPage: number = 1;
  feesCurrentPage: number = 1;
  itemsPerPage: number = 20;
  additionalFees: PagingResponse<Fee>;
  travels: PagingResponse<Travel>;
  flights: PagingResponse<Flight>;
  hotels: PagingResponse<Hotel>;

  constructor(
    private dialog: MatDialog,
    private feeService: FeeService,
    private travelService: TravelService,
    private hotelService: HotelsService,
    private airlineService: AirlinesService) {
      this.getFees();
    }

  ngOnInit() {
  }

  getTravels() {
    this.loader = this.travelService.getAllTravels(this.travelsCurrentPage, this.itemsPerPage)
    .subscribe(
      res => this.travels = res,
      err => console.log(err)
    );
  }

  getHotels() {
    this.loader = this.hotelService.getHotels(this.hotelsCurrentPage, this.itemsPerPage)
    .subscribe(
      res => this.hotels = res,
      err => console.log(err)
    );
  }

  getFlights() {
    this.loader = this.airlineService.getAirlines(this.hotelsCurrentPage, this.itemsPerPage)
    .subscribe(
      res => this.hotels = res,
      err => console.log(err)
    );
  }

  getFees() {
    this.loader = this.feeService.getFees(this.feesCurrentPage, this.itemsPerPage)
    .subscribe(
      res => this.additionalFees = res,
      err => console.log(err)
    );
  }

  feesPageChanged(page) {
    this.feesCurrentPage = page;
    this.getFees();
  }

  openServiceFeeDialog() {
    let dialogRef = this.dialog.open(ServiceFeeDialogComponent, {
      autoFocus: true,
      width: '534px'
    });

    dialogRef.afterClosed().subscribe(newFee => {
      if (newFee) {
        this.feesCurrentPage = 1;
        this.getFees();
      }
    });
  }

  displayCategories(fee: Fee) {
    var display = '';
    if (fee && fee.categories) {
      for(let i = 0; i < fee.categories.length; i++) {
        var category = fee.categories[i];
        if (category == Category.Hajj) {
          display += 'Hajj, ';
        }
        else if (category == Category.Omra) {
          display += 'Omra, ';
        }
        else if (category == Category.Travel) {
          display += 'Voyage, ';
        }
        else if (category == Category.Hotel) {
          display += 'Hôtel, ';
        }
        else if (category == Category.Flight) {
          display += 'Vol, ';
        }
      }
      return display.slice(0, -2);
    }
    return display;
  }
}
