import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TravelService } from '../../travels/travel.service';
import { Customer } from '../../customers/customer.model';
import { CustomerTravel } from '../../customers/customer-travel.model';
import { Omra } from '../omra.model';

@Component({
  selector: 'app-omra-add-customers',
  templateUrl: './omra-add-customers.component.html',
  styleUrls: ['./omra-add-customers.component.scss']
})
export class OmraAddCustomersComponent implements OnInit {
  customers: Customer[];
  omra: Omra;
  isGroup: boolean;
  isEdit: boolean = false;

  // For edit mode
  customerTravel: CustomerTravel;

  constructor(
    private travelService: TravelService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params['id'] && params['customerId']) {
        this.travelService.getTraveler(params['id'], params['customerId'], true)
          .subscribe(
            res => {
              if (!res) {
                this.router.navigate(['../../'], { relativeTo: this.route });
              }
              else {
                this.isEdit = true;
                this.omra = res.travel;
                this.isGroup = res.customer.relationship != null;
                this.customers = [res.customer];
                this.customerTravel = res;
              }
            });
        }
        else {
          if (this.travelService.travelWithCustomers) {
            this.customers = this.travelService.travelWithCustomers.customers;
            this.omra = this.travelService.travelWithCustomers.travel;
            this.isGroup = this.travelService.travelWithCustomers.isGroup;
            this.travelService.travelWithCustomers = null;
          }
          else {
              this.router.navigate(['../../'], { relativeTo: this.route });
          }
        }
    });
  }
}