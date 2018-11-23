import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Customer } from '../customer.model';
import { CustomersService } from '../customers.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit {
  isEditing = false;
  customer: Customer;

  constructor(
    private route: ActivatedRoute,
    private service: CustomersService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params['id']) {
          this.customer = this.service.customers.filter(c => c.id == params['id'])[0];
      }
    })
  }

  editCustomer() {
    this.isEditing = true;
  }

  saveCustomer(customer: Customer) {
    this.isEditing = false;
    this.customer = customer;
  }
}
