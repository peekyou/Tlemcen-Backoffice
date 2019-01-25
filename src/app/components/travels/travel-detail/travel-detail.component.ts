import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';

import { Customer } from '../../../customers/customer.model';
import { TravelService } from '../../../travels/travel.service';
import { HajjService } from '../../../hajj/hajj.service';
import { Hotel } from '../../../hotels/hotel.model';
import { HotelReservation } from '../../../hotels/hotel-reservation.model';
import { HotelRoomReservation } from '../../../hotels/hotel-room-reservation.model';
import { Airline } from '../../../airlines/airline.model';
import { FlightBooking } from '../../../airlines/flight-booking.model';
import { Travel, TravelType } from '../../../travels/travel.model';
import { SearchCustomerDialogComponent } from '../../customers/search-customer-dialog/search-customer-dialog.component';
import { HotelRoomsDialogComponent } from '../..//hotels/hotel-rooms-dialog/hotel-rooms-dialog.component';
import { FlightBookingDialogComponent } from '../..//airlines/flight-booking-dialog/flight-booking-dialog.component';
import { DeleteDialogComponent } from '../..//common/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-travel-detail',
  templateUrl: './travel-detail.component.html',
  styleUrls: ['./travel-detail.component.scss']
})
export class TravelDetailComponent implements OnInit {
  moment;
  travel: Travel;
  currentPage: number = 1;
  itemsPerPage = 10;
  generatingAirlinesFiles = false;
  generatingBadges = false;

  constructor(
    private hajjService: HajjService, 
    private service: TravelService, 
    private dialog: MatDialog, 
    private router: Router,
    private route: ActivatedRoute) { 
      this.moment = moment;
  }

  ngOnInit() {
    window.scroll(0,0);
    
    this.route.params.subscribe(params => {
      if(params['id']) {
        this.loadTravel(params['id']);
      }
    });
  }

  loadTravel(travelId: string) {
    this.service.getTravel(travelId, this.itemsPerPage)
    .subscribe(
      res => {
        this.travel = res
        if (!this.travel) {
          var route = this.travel.travelTypeId == TravelType.Hajj ? '/hajj' : this.travel.travelTypeId == TravelType.Omra ? '/omra' : '/travel';
          this.router.navigate([route]);
        }
      });
  }

  openAddCustomerDialog(isGroup = false) {
    let dialogRef = this.dialog.open(SearchCustomerDialogComponent, {
        autoFocus: false,
        width: isGroup ? '634px' : '534px',
        data: {
          title: 'Pèlerins ' + this.travel.name,
          travel: this.travel,
          isGroup: isGroup
        }
    });

    // const sub = dialogRef.componentInstance.onCustomersAdded.subscribe((customers: Customer[]) => {
    // });

    dialogRef.afterClosed().subscribe((customers: Customer[]) => {
      if (customers && customers.length > 0) {
        this.service.validateTravelers(this.travel.id, customers.map(a => a.id))
          .subscribe(res => {
            // dialogRef.componentInstance.onCustomersAdded.unsubscribe();
            this.service.travelWithCustomers = { 
              travel: this.travel,
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
          title: 'Hôtel ' + this.travel.name,
          hotelReservation: hotelReservation,
          travelId: this.travel.id
        }
    });

    dialogRef.afterClosed().subscribe((newReservation: HotelReservation) => {
      if (newReservation) {
        this.service.getHotelBookings(this.travel.id).subscribe(res => this.travel.hotelBookings = res);
      }
    });
  }

  openFlightBookingDialog(flightBooking: FlightBooking = null) {
    let dialogRef = this.dialog.open(FlightBookingDialogComponent, {
        autoFocus: false,
        width: '734px',
        data: {
          flightBooking: flightBooking,
          travelId: this.travel.id
        }
    });

    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res === true) {
        this.service.getFlightBookings(this.travel.id).subscribe(res => this.travel.flightBookings = res);
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
        this.service.removeTravelers(this.travel.id, [customer.id])
        .subscribe(
          res => {
            if (res === true) {
              this.currentPage = 1;
              this.loadTravel(this.travel.id);
            }
          });
      }
    });
  }

  openDeleteHotelBooking(booking: HotelReservation) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      autoFocus: false,
      data: { name: booking.hotel.name + ' ainsi que toutes les chambres' }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.service.removeHotelBooking(this.travel.id, booking)
        .subscribe(
          res => {
            if (res === true) {
              this.loadTravel(this.travel.id);
            }
          });
      }
    });
  }

  openDeleteFlightBooking(booking: FlightBooking) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      autoFocus: false,
      data: { name: booking.flight.airline.name + ' ' + booking.flight.airportFrom + ' -> ' + booking.flight.airportTo }
    });
    
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.service.removeFlightBooking(this.travel.id, booking)
        .subscribe(
          res => {
            if (res === true) {
              this.loadTravel(this.travel.id);
            }
          });
      }
    });
  }

  downloadTravelerContract(customer: Customer) {
    this.service.downloadTravelerContract(this.travel.id, customer.id)
    .subscribe(res => {});
  }

  downloadPaymentReceipt(customer: Customer) {
    this.service.downloadPaymentReceipt(this.travel.id, customer.id)
    .subscribe(res => {});
  }

  downloadTravelerBadge(customer: Customer) {
    this.service.downloadTravelerBadge(this.travel.id, customer.id)
    .subscribe(res => {});
  }

  downloadAllBadges() {
    this.generatingBadges = true;
    this.service.downloadAllBadges(this.travel.id)
    .subscribe(
      res => this.generatingBadges = false,
      err => this.generatingBadges = false
    );
  }

  downloadAirlinesFile() {
    this.generatingAirlinesFiles = true;
    this.service.downloadAirlineFile(this.travel.id, '2')
    .subscribe(
      res => this.generatingAirlinesFiles = false,
      err => this.generatingAirlinesFiles = false
    );
  }

  pageChanged(page) {
    this.currentPage = page;
    this.service.getTravelers(this.travel.id, this.currentPage, this.itemsPerPage)
      .subscribe(res => this.travel.customers = res);
  }
}