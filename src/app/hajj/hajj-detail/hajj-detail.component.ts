import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';

import { Customer } from '../../customers/customer.model';
import { TravelService } from '../../travels/travel.service';
import { HajjService } from '../hajj.service';
import { Hajj } from '../hajj.model';
import { Hotel } from '../../hotels/hotel.model';
import { HotelReservation } from '../../hotels/hotel-reservation.model';
import { HotelRoomReservation } from '../../hotels/hotel-room-reservation.model';
import { Airline } from '../../airlines/airline.model';
import { TravelType } from '../../travels/travel.model';
import { SearchCustomerDialogComponent } from '../../components/customers/search-customer-dialog/search-customer-dialog.component';
import { HotelRoomsDialogComponent } from '../../components/hotels/hotel-rooms-dialog/hotel-rooms-dialog.component';
import { DeleteDialogComponent } from '../../components/common/delete-dialog/delete-dialog.component';

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
    private travelService: TravelService, 
    private dialog: MatDialog, 
    private router: Router,
    private route: ActivatedRoute) { 

    this.moment = moment;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params['id']) {
        this.service.getHajj(params['id'])
          .subscribe(
            res => {
              this.hajj = res
              if (!this.hajj) {
                this.router.navigate(['/hajj']);
              }
            });
      }
    });
  }

  openAddCustomerDialog() {
    let dialogRef = this.dialog.open(SearchCustomerDialogComponent, {
        autoFocus: false,
        width: '534px',
        data: {
          title: 'Pèlerins Hajj ' + this.hajj.name,
          travel: this.hajj
        }
    });

    // const sub = dialogRef.componentInstance.onCustomersAdded.subscribe((customers: Customer[]) => {
    // });

    dialogRef.afterClosed().subscribe((customers: Customer[]) => {
        this.travelService.validateTravelers(this.hajj.id, customers.map(a => a.id))
          .subscribe(res => {
            // dialogRef.componentInstance.onCustomersAdded.unsubscribe();
            this.travelService.travelWithCustomers = { travel: this.hajj, customers: customers };
            this.router.navigate(['./customers/add'], { relativeTo: this.route });
          })
    });
  }

  openRoomReservationDialog(hotelReservation: HotelReservation = null) {
    let dialogRef = this.dialog.open(HotelRoomsDialogComponent, {
        autoFocus: false,
        width: '534px',
        data: {
          title: 'Hôtel Hajj ' + this.hajj.name,
          hotelReservation: hotelReservation
        }
    });

    dialogRef.afterClosed().subscribe((newReservation: HotelReservation) => {
      if (newReservation && hotelReservation) {
        hotelReservation.rooms = newReservation.rooms;
      }
      else if (newReservation) {
        this.hajj.hotelBookings.push(newReservation);
      }
    });
  }

  getReservationAvailableSpace(reservation: HotelReservation) {
    return HotelReservation.getAvailableSpace(reservation);
  }

  openDeletePilgrimDialog(customer: Customer) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      autoFocus: false,
      data: { name: customer.firstname + ' ' + customer.lastname }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.travelService.removeTravelers(this.hajj.id, [customer.id])
        .subscribe(
          res => {
            var index = this.hajj.customers.indexOf(customer);
            if (index > -1) {
                this.hajj.customers.splice(index, 1);
                // this.hajj.paging.totalCount--;
            }
          });
      }
    });
  }
}