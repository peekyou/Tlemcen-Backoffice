import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';

import { Customer } from '../../customers/customer.model';
import { CustomersService } from '../../customers/customers.service';
import { HajjService } from '../hajj.service';
import { Hajj } from '../hajj.model';
import { Hotel } from '../../hotels/hotel.model';
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
    private route: ActivatedRoute) { 

    this.moment = moment;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params['id']) {
          this.hajj = this.service.hajjList.filter(c => c.id == params['id'])[0];
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

  openAddHotelDialog() {
    let dialogRef = this.dialog.open(HotelRoomsDialogComponent, {
        autoFocus: false,
        width: '534px',
        data: {
          title: 'Hôtel Hajj ' + this.hajj.year
        }
    });

    dialogRef.afterClosed().subscribe(hotel => {
        if (hotel) {
          if (!this.hajj.hotels) {
            this.hajj.hotels = [];
          }
          this.hajj.hotels.push(hotel);
        }
    });
  }
}