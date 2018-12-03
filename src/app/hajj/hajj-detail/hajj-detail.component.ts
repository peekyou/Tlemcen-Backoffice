import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';

import { Customer } from '../../customers/customer.model';
import { CustomersService } from '../../customers/customers.service';
import { HajjService } from '../hajj.service';
import { Hajj } from '../hajj.model';
import { Hotel } from '../../hotels/hotel.model';
import { HotelReservation } from '../../hotels/hotel-reservation.model';
import { HotelRoomReservation } from '../../hotels/hotel-room-reservation.model';
import { Airline } from '../../airlines/airline.model';
import { SearchCustomerDialogComponent } from '../../components/customers/search-customer-dialog/search-customer-dialog.component';
import { HotelRoomsDialogComponent } from '../../components/hotels/hotel-rooms-dialog/hotel-rooms-dialog.component';

@Component({
  selector: 'app-hajj-detail',
  templateUrl: './hajj-detail.component.html',
  styleUrls: ['./hajj-detail.component.scss']
})
export class HajjDetailComponent implements OnInit {
  moment;
  hajj: Hajj;

  constructor(
    private service: HajjService, 
    private customerService: CustomersService, 
    private dialog: MatDialog, 
    private router: Router,
    private route: ActivatedRoute) { 

    this.moment = moment;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params['id']) {
          this.hajj = this.service.hajjList.filter(c => c.id == params['id'])[0];
      }
      if (!this.hajj) {
        this.router.navigate(['/hajj']);
      }
    });
  }

  openAddCustomerDialog() {
    let dialogRef = this.dialog.open(SearchCustomerDialogComponent, {
        autoFocus: false,
        width: '534px',
        data: {
          title: 'Pèlerins Hajj ' + this.hajj.year
        }
    });

    const sub = dialogRef.componentInstance.onCustomersAdded.subscribe((customers: Customer[]) => {
      if (!this.hajj.customers) {
        this.hajj.customers = [];
      }
      this.hajj.customers = this.hajj.customers.concat(customers);
    });

    dialogRef.afterClosed().subscribe(customer => {
        dialogRef.componentInstance.onCustomersAdded.unsubscribe();
    });
  }

  openRoomReservationDialog(hotelReservation: HotelReservation = null) {
    let dialogRef = this.dialog.open(HotelRoomsDialogComponent, {
        autoFocus: false,
        width: '534px',
        data: {
          title: 'Hôtel Hajj ' + this.hajj.year,
          hotelReservation: hotelReservation
        }
    });

    dialogRef.afterClosed().subscribe((newReservation: HotelReservation) => {
      if (newReservation && hotelReservation) {
        hotelReservation.rooms = newReservation.rooms;
      }
      else if (newReservation) {
        this.hajj.reservations.push(newReservation);
      }
    });
  }
}