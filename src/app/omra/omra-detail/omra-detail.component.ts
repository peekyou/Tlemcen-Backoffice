import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';

import { Customer } from '../../customers/customer.model';
import { CustomersService } from '../../customers/customers.service';
import { OmraService } from '../omra.service';
import { Omra } from '../omra.model';
import { Hotel } from '../../hotels/hotel.model';
import { HotelReservation } from '../../hotels/hotel-reservation.model';
import { HotelRoomReservation } from '../../hotels/hotel-room-reservation.model';
import { Airline } from '../../airlines/airline.model';
import { SearchCustomerDialogComponent } from '../../components/customers/search-customer-dialog/search-customer-dialog.component';
import { HotelRoomsDialogComponent } from '../../components/hotels/hotel-rooms-dialog/hotel-rooms-dialog.component';

@Component({
  selector: 'app-omra-detail',
  templateUrl: './omra-detail.component.html',
  styleUrls: ['./omra-detail.component.scss']
})
export class OmraDetailComponent implements OnInit {
  moment;
  omra: Omra;

  constructor(
    private service: OmraService, 
    private customerService: CustomersService, 
    private dialog: MatDialog, 
    private router: Router,
    private route: ActivatedRoute) { 

    this.moment = moment;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params['id']) {
          this.omra = this.service.omraList.filter(c => c.id == params['id'])[0];
      }
      if (!this.omra) {
        this.router.navigate(['/omra']);
      }
    });
  }

  openAddCustomerDialog() {
    let dialogRef = this.dialog.open(SearchCustomerDialogComponent, {
        autoFocus: false,
        width: '534px',
        data: {
          title: 'Pèlerins Omra ' + this.omra.name
        }
    });

    const sub = dialogRef.componentInstance.onCustomersAdded.subscribe((customers: Customer[]) => {
      if (!this.omra.customers) {
        this.omra.customers = [];
      }
      this.omra.customers = this.omra.customers.concat(customers);
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
          title: 'Hôtel Omra ' + this.omra.name,
          hotelReservation: hotelReservation
        }
    });

    dialogRef.afterClosed().subscribe((newReservation: HotelReservation) => {
      if (newReservation && hotelReservation) {
        hotelReservation.rooms = newReservation.rooms;
      }
      else if (newReservation) {
        this.omra.reservations.push(newReservation);
      }
    });
  }
}
