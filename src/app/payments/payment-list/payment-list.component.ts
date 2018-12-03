import { Component, OnInit } from '@angular/core';

import { Payment } from '../payment.model';
import { PaymentService } from '../payment.service';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent implements OnInit {
  payments: Payment[];

  constructor(private service: PaymentService) {
    this.payments = service.payments;
  }

  ngOnInit() {
  }

}
