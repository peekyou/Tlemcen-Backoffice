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
import { FlightBooking } from '../../airlines/flight-booking.model';
import { TravelType } from '../../travels/travel.model';
import { SearchCustomerDialogComponent } from '../../components/customers/search-customer-dialog/search-customer-dialog.component';
import { HotelRoomsDialogComponent } from '../../components/hotels/hotel-rooms-dialog/hotel-rooms-dialog.component';
import { FlightBookingDialogComponent } from '../../components/airlines/flight-booking-dialog/flight-booking-dialog.component';
import { DeleteDialogComponent } from '../../components/common/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-hajj-detail',
  templateUrl: './hajj-detail.component.html',
  styleUrls: ['./hajj-detail.component.scss']
})
export class HajjDetailComponent implements OnInit {
  moment;
  hajj: Hajj;
  currentPage: number = 1;
  itemsPerPage = 5;

  constructor(
    private service: HajjService, 
    private travelService: TravelService, 
    private dialog: MatDialog, 
    private router: Router,
    private route: ActivatedRoute) { 
      this.moment = moment;
  }

  ngOnInit() {
    window.scroll(0,0);
    
    this.route.params.subscribe(params => {
      if(params['id']) {
        this.loadHajj(params['id']);
      }
    });
  }

  loadHajj(hajjId: string) {
    this.service.getHajj(hajjId, this.itemsPerPage)
    .subscribe(
      res => {
        this.hajj = res
        if (!this.hajj) {
          this.router.navigate(['/hajj']);
        }
      });
  }

  openAddCustomerDialog(isGroup = false) {
    let dialogRef = this.dialog.open(SearchCustomerDialogComponent, {
        autoFocus: false,
        width: '534px',
        data: {
          title: 'Pèlerins Hajj ' + this.hajj.name,
          travel: this.hajj,
          isGroup: isGroup
        }
    });

    // const sub = dialogRef.componentInstance.onCustomersAdded.subscribe((customers: Customer[]) => {
    // });

    dialogRef.afterClosed().subscribe((customers: Customer[]) => {
      if (customers && customers.length > 0) {
        this.travelService.validateTravelers(this.hajj.id, customers.map(a => a.id))
          .subscribe(res => {
            // dialogRef.componentInstance.onCustomersAdded.unsubscribe();
            this.travelService.travelWithCustomers = { 
              travel: this.hajj,
              customers: customers,
              isGroup: isGroup
            };
            this.router.navigate(['./customers'], { relativeTo: this.route });
          });
        }
    });
  }

  openRoomReservationDialog(hotelReservation: HotelReservation = null) {
    let dialogRef = this.dialog.open(HotelRoomsDialogComponent, {
        autoFocus: false,
        width: '534px',
        data: {
          title: 'Hôtel Hajj ' + this.hajj.name,
          hotelReservation: hotelReservation,
          travelId: this.hajj.id
        }
    });

    dialogRef.afterClosed().subscribe((newReservation: HotelReservation) => {
      if (newReservation) {
        this.service.getHotelBookings(this.hajj.id).subscribe(res => this.hajj.hotelBookings = res);
      }
    });
  }

  openFlightBookingDialog(flightBooking: FlightBooking = null) {
    let dialogRef = this.dialog.open(FlightBookingDialogComponent, {
        autoFocus: false,
        width: '734px',
        data: {
          flightBooking: flightBooking,
          travelId: this.hajj.id
        }
    });

    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res === true) {
        this.service.getFlightBookings(this.hajj.id).subscribe(res => this.hajj.flightBookings = res);
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
            if (res === true) {
              this.currentPage = 1;
              this.loadHajj(this.hajj.id);
            }
          });
      }
    });
  }

  downloadTravelerContract(customer: Customer) {
    this.travelService.downloadTravelerContract(this.hajj.id, customer.id)
    .subscribe(res => {});
  }

  pageChanged(page) {
    this.currentPage = page;
    this.travelService.getTravelers(this.hajj.id, this.currentPage, this.itemsPerPage)
      .subscribe(res => this.hajj.customers = res);
  }
}