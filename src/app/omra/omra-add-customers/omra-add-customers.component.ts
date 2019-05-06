import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TravelService } from '../../travels/travel.service';
import { TravelGroup } from '../../travels/travel-group.model';
import { Customer } from '../../customers/customer.model';
import { CustomerTravel } from '../../customers/customer-travel.model';
import { Omra } from '../omra.model';

@Component({
  selector: 'app-omra-add-customers',
  templateUrl: './omra-add-customers.component.html',
  styleUrls: ['./omra-add-customers.component.scss']
})
export class OmraAddCustomersComponent implements OnInit {
  omra: Omra;
  isGroup: boolean;
  isEdit: boolean = false;
  travelGroup: TravelGroup;

  constructor(
    private travelService: TravelService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params['id'] && params['customerId']) {
        this.travelService.getGroupTravelers(params['id'], params['customerId'])
          .subscribe(
            res => {
              if (!res) {
                this.router.navigate(['../../'], { relativeTo: this.route });
              }
              else {
                this.isEdit = true;
                this.omra = res.travel;
                this.isGroup = res.groupId != null;
                this.travelGroup = res;
              }
            });
        }
        else {
          if (this.travelService.travelWithCustomers) {
            this.travelGroup = {
              travel: this.travelService.travelWithCustomers.travel,
              customers: this.travelService.travelWithCustomers.customers
            };
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