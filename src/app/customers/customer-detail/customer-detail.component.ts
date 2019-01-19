import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

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
  saveSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private service: CustomersService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params['id']) {
        this.getCustomer(params['id']);
      }
    })
  }

  editCustomer() {
    this.isEditing = true;
  }

  saveCustomer(customer: Customer) {
    this.saveSubscription = this.service.updateCustomer(customer)
    .subscribe(res => {
      if (res === true) {
        this.isEditing = false;
        this.getCustomer(customer.id);
      }
    });
  }

  getCustomer(id) {
    this.service.getCustomer(id).subscribe(res => this.customer = res);
  }
}
