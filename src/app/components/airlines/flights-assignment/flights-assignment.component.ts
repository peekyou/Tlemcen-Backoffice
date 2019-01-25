import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription, forkJoin } from 'rxjs';

import { FlightBooking } from '../../../airlines/flight-booking.model';
import { DeleteDialogComponent } from '../../../components/common/delete-dialog/delete-dialog.component';
import { Customer } from '../../../customers/customer.model';
import { PagingResponse } from '../../../core/models/paging';
import { AirlinesService } from '../../../airlines/airlines.service';

@Component({
  selector: 'app-flights-assignment',
  templateUrl: './flights-assignment.component.html',
  styleUrls: ['./flights-assignment.component.scss']
})
export class FlightsAssignmentComponent implements OnInit {
  @Input() flightBookings: FlightBooking[] = [];
  @Input() travelId: string;

  loader: Subscription;
  pages = {};
  itemsPerPage = 10;
  travelersByFlight?: any = {};

  constructor(private dialog: MatDialog, private service: AirlinesService) {
  }

  ngOnInit() {
    this.flightBookings.forEach(x => {
      x.expanded = true;
      this.pages[x.id] = 1;
      this.loadTravelers(x.id);
    });
  }

  pageChanged(page, flightId) {
    this.pages[flightId] = page;
    this.loadTravelers(flightId);
  }

  loadTravelers(flightId) {
    this.loader = this.service.getFlightTravelers(flightId, this.pages[flightId], this.itemsPerPage)
      .subscribe(res => this.travelersByFlight[flightId] = res);
  }

  openRemovePilgrimDialog(flight: FlightBooking, customer: Customer) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      autoFocus: false,
      data: { name: customer.firstname + ' ' + customer.lastname }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.service.removeTravelerFromFlight(flight.id, customer.id)
        .subscribe(
          res => {
            this.pages[flight.id] = 1;
            this.loadTravelers(flight.id);
          });
      }
    });
  }
}
