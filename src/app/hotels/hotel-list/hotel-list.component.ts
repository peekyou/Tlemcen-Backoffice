import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { HotelDialogComponent } from '../hotel-dialog/hotel-dialog.component';
import { HotelsService } from '../hotels.service';
import { Hotel } from '../hotel.model';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.scss']
})
export class HotelListComponent implements OnInit {
  hotels: Hotel[];

  constructor(private service: HotelsService, private dialog: MatDialog) { 
    this.hotels = service.hotels;
  }

  ngOnInit() {
  }

  openHotelDialog(hotel: Hotel = null) {
    let dialogRef = this.dialog.open(HotelDialogComponent, {
      autoFocus: false,
      width: '534px',
      data: {
        hotel: hotel
      }
    });

    dialogRef.afterClosed().subscribe(res => {
    });
  }
}
