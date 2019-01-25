import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription, forkJoin } from 'rxjs';

import { FlightBooking } from '../../../airlines/flight-booking.model';
import { DeleteDialogComponent } from '../../../components/common/delete-dialog/delete-dialog.component';
import { Customer } from '../../../customers/customer.model';
import { PagingResponse } from '../../../core/models/paging';
import { AirlinesService } from '../../../airlines/airlines.service';
import { SearchCustomerDialogComponent } from '../../customers/search-customer-dialog/search-customer-dialog.component';
import { ToasterService } from '../../../core/services/toaster.service';
import { ToasterType } from '../../../core/models/toaster-type';

@Component({
  selector: 'app-flight-detail',
  templateUrl: './flight-detail.component.html',
  styleUrls: ['./flight-detail.component.scss']
})
export class FlightDetailComponent implements OnInit {
  @Input() flightBookingId: string;
  @Input() travelId: string;

  flightBooking: FlightBooking;
  loader: Subscription;
  currentPage = 1;
  itemsPerPage = 10;
  travelers: PagingResponse<Customer>;

  constructor(
    private dialog: MatDialog,
    private service: AirlinesService,
    public toasterService: ToasterService) {
  }

  ngOnInit() {
    this.loader = this.service.getFlight(this.flightBookingId).subscribe(res => this.flightBooking = res);
    this.loadTravelers();
  }

  pageChanged(page) {
    this.currentPage = page;
    this.loadTravelers();
  }

  loadTravelers() {
    this.loader = this.service.getFlightTravelers(this.flightBookingId, this.currentPage, this.itemsPerPage)
      .subscribe(res => this.travelers = res);
  }

  openRemovePilgrimDialog(customer: Customer) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      autoFocus: false,
      data: { name: customer.firstname + ' ' + customer.lastname }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.service.removeTravelerFromFlight(this.flightBookingId, customer.id)
        .subscribe(
          res => {
            this.currentPage = 1;
            this.loadTravelers();
          });
      }
    });
  }

  openAddCustomerDialog() {
    let dialogRef = this.dialog.open(SearchCustomerDialogComponent, {
        autoFocus: false,
        width: '534px',
        data: {
          title: 'Voyageurs vol ' + this.flightBooking.flight.airline.name + ' ' + this.flightBooking.flight.flightNumber
        }
    });

    dialogRef.afterClosed().subscribe((customers: Customer[]) => {
      if (customers && customers.length > 0) {
        this.service.addTravelersInFlight(this.flightBookingId, customers.map(x => x.id))
          .subscribe(res => {
            this.toasterService.showToaster('Voyageur(s) ajouté(s)', ToasterType.Success);
            this.currentPage = 1;
            this.loadTravelers();
          });
        }
    });
  }
}
