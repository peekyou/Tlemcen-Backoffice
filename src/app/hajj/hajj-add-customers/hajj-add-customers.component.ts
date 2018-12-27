import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TravelService } from '../../travels/travel.service';
import { Customer } from '../../customers/customer.model';
import { Hajj } from '../hajj.model';

@Component({
  selector: 'app-hajj-add-customers',
  templateUrl: './hajj-add-customers.component.html',
  styleUrls: ['./hajj-add-customers.component.scss']
})
export class HajjAddCustomersComponent implements OnInit {
  customers: Customer[];
  hajj: Hajj;

  constructor(
    private travelService: TravelService,
    private router: Router,
    private route: ActivatedRoute) {

    if (travelService.travelWithCustomers) {
      this.customers = travelService.travelWithCustomers.customers;
      this.hajj = travelService.travelWithCustomers.travel;
    }
    else {
        this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }

  ngOnInit() {
  }
}
