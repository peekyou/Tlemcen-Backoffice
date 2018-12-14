import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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

    dialogRef.afterClosed().subscribe(newHotel => {
    });
  }

  openDeleteDialog(hotel: Hotel) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      autoFocus: false,
      data: { name: hotel.name }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.service.delete(hotel.id)
        .subscribe(
          res => this.hotels = this.service.hotels,
          err => console.log(err)
        );
      }
    });
  }
}
