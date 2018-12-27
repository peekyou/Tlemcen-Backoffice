import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';

import { PagingResponse } from '../../core/models/paging';
import { Airline } from '../airline.model';
import { AirlinesService } from '../airlines.service';
import { AirlineDialogComponent } from '../airline-dialog/airline-dialog.component';
import { DeleteDialogComponent } from '../../components/common/delete-dialog/delete-dialog.component';

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

  constructor(private service: AirlinesService, private dialog: MatDialog) {
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

  openAirlineDialog(airline: Airline = null) {
    let dialogRef = this.dialog.open(AirlineDialogComponent, {
      autoFocus: true,
      width: '534px',
      data: {
        airline: airline
      }
    });

    dialogRef.afterClosed().subscribe(newHotel => {
      if (newHotel) {
        this.currentPage = 1;
        this.getAirlines();
      }
    });
  }

  openDeleteDialog(airline: Airline) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      autoFocus: false,
      data: { name: airline.name }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.service.deleteAirline(airline.id)
        .subscribe(
          res => {
            var index = this.airlines.data.indexOf(airline);
            if (index > -1) {
                this.airlines.data.splice(index, 1);
                this.airlines.paging.totalCount--;
            }
          },
          err => console.log(err)
        );
      }
    });
  }
}