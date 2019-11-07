import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';

import { PagingResponse } from '../../core/models/paging';
import { Payment } from '../payment.model';
import { PaymentService } from '../payment.service';
import { PaymentDialogComponent } from '../../components/payment/payment-dialog/payment-dialog.component';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent implements OnInit {
  loader: Subscription;
  currentPage: number = 1;
  itemsPerPage: number = 20;
  payments: PagingResponse<Payment>;

  constructor(private service: PaymentService, private dialog: MatDialog) {
    this.getPayments();
  }

  ngOnInit() {
  }

  getPayments() {
    window.scroll(0,0);

    this.loader = this.service.getPayments(this.currentPage, this.itemsPerPage)
    .subscribe(
      res => this.payments = res,
      err => console.log(err)
    );
  }

  pageChanged(page) {
    this.currentPage = page;
    this.getPayments();
  }

  openPaymentDialog(payment: Payment) {
    let dialogRef = this.dialog.open(PaymentDialogComponent, {
      autoFocus: true,
      width: '534px',
      data: {
        payment
      }
    });
  }
}
