import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { PagingResponse } from '../../core/models/paging';
import { DeleteDialogComponent } from '../../components/common/delete-dialog/delete-dialog.component';
import { HotelDialogComponent } from '../hotel-dialog/hotel-dialog.component';
import { HotelsService } from '../hotels.service';
import { Hotel } from '../hotel.model';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.scss']
})
export class HotelListComponent implements OnInit {
  loader: Subscription;
  currentPage: number = 1;
  itemsPerPage: number = 20;
  hotels: PagingResponse<Hotel>;

    constructor(private service: HotelsService, private dialog: MatDialog) { 
      this.getHotels();
  }

  ngOnInit() {
  }

  getHotels() {
    window.scroll(0,0);

    this.loader = this.service.getHotels(this.currentPage, this.itemsPerPage)
    .subscribe(
      res => this.hotels = res,
      err => console.log(err)
    );
  }

  pageChanged(page) {
    this.currentPage = page;
    this.getHotels();
  }

  openHotelDialog(hotel: Hotel = null) {
    let dialogRef = this.dialog.open(HotelDialogComponent, {
      autoFocus: true,
      width: '534px',
      data: {
        hotel: hotel
      }
    });

    dialogRef.afterClosed().subscribe(newHotel => {
      if (newHotel) {
        this.currentPage = 1;
        this.getHotels();
      }
    });
  }

  openDeleteDialog(hotel: Hotel) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      autoFocus: false,
      data: { name: hotel.name }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.service.deleteHotel(hotel.id)
        .subscribe(
          res => {
            var index = this.hotels.data.indexOf(hotel);
            if (index > -1) {
                this.hotels.data.splice(index, 1);
                this.hotels.paging.totalCount--;
            }
          },
          err => console.log(err)
        );
      }
    });
  }
}
