import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';

import { CustomerDetail } from '../../customers/customer-detail.model';
import { DeleteDialogComponent } from '../../components/common/delete-dialog/delete-dialog.component';
import { Payment, PaymentType } from '../../payments/payment.model';
import { Travel, TravelType } from '../../travels/travel.model';
import { PaymentService } from '../../payments/payment.service';
import { Fee } from '../../management/fees-management/fee.model';
import { FeeService } from '../../management/fees-management/fee.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  loading: boolean;
  form: FormGroup;
  loader: Subscription;
  paymentTypes: PaymentType[] = [];
  paymentHistory: Payment[] = [];
  _customer: CustomerDetail = {};
  _fees: Fee[] = [];
  
  @Input() 
  set customer(customer: CustomerDetail) {
    this._customer = customer;
    if (customer.payments && customer.payments.length > 0) {
      this.paymentHistory = customer.payments.map(x => ({ ...x })); // clone payments
    }

    if (this.form) {
      this.form.reset();
    }  
  }
  get customer(): CustomerDetail {
      return this._customer;
  }

  @Input() 
  set fees(fees: Fee[]) {
    this._fees = fees;
    if (this.form) {
      this.emitChanges();
    }  
  }
  get fees(): Fee[] {
      return this._fees;
  }

  @Input() readOnly = false;
  @Input() travel: Travel;
  @Output() onChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private paymentService: PaymentService,
    private feeService: FeeService) {
  }

  ngOnInit() {
    if (!this.readOnly) {
      this.paymentService.getPaymentTypes().subscribe(res => this.paymentTypes = res);
    }

    this.sumCustomerPayments();
    
    if (this.travel) {
      this._fees.unshift({
        name: this.travel.travelTypeId == TravelType.Hajj ? this.travel.name : this.travel.name,
        price: this.travel.unitPrice,
        isServiceFee: false,
        isMandatoryFee: true
      });
    }

    this.form = this.fb.group({
      amount: [null, Validators.required],
      discount: [null],
      paymentType: [null],
      payLater: [false]
    });

    this.form.valueChanges.subscribe(data => {
      this.emitChanges();
    });

    // Emit empty payment in case there is no change in the form before sending
    this.emitChanges();
  }

  sumCustomerPayments() {
    this._customer.travelPayment = new Payment();
    this.paymentHistory.forEach(p => {
      // The latest payment is the current one
      this._customer.travelPayment.amount = p.amount;
      this._customer.travelPayment.discount += p.discount;
      this._customer.travelPayment.amountPaid += p.amountPaid;
    });
  }

  emitChanges() {
    this.onChange.emit(this.getPayment());
  }

  private getPayment(): Payment {
    var totalAmount = this.calculateTotal(true);

    // If edit mode, the previsous discount is included in the total for display purpose
    // We need to remove it for saving in DB
    if (this._customer.travelPayment) {
      totalAmount += this._customer.travelPayment.discount;
    }

    var payment: Payment = {
      amountPaid: this.form.value.payLater ? 0 : this.form.value.amount,
      discount: this.form.value.discount,
      amount: totalAmount,
      paymentTypeId: this.form.value.paymentType,
      payLater: this.form.value.payLater
    };
    return payment;
  }

  calculateTotal(exludePreviousCustomerFees = false) {
    var fees = exludePreviousCustomerFees ? this._fees.filter(x => !x.isPreviousFee) : this._fees;
    var total = fees.reduce(function(a, b){
      return a + b.price;
    }, 0);

    if (this._customer.travelPayment.discount) {
      total = Math.max(0, total - this._customer.travelPayment.discount);
    }
    return total;
  }

  getAmountToPay(minValueZero = true) {
    var discount = 0;
    var totalAmount = this.calculateTotal();

    if (this.form.value.discount) {
      discount += this.form.value.discount;
    }

    if (this._customer.travelPayment.amountPaid) {
      totalAmount = totalAmount - this._customer.travelPayment.amountPaid;
      return totalAmount - discount;
    }
    return minValueZero ? Math.max(0, totalAmount - discount) : totalAmount - discount;
  }

  getAmountToRefund() {
    var amountToPay = this.getAmountToPay(false);
    if (amountToPay < 0) {
      return Math.abs(amountToPay);
    }
    return 0;
  }

  updatePayment(payment: Payment) {
    payment.isEdit = false;
    this.paymentService.updatePayment(payment)
      .subscribe(
        res => this.sumCustomerPayments(),
        err => console.log(err)
      );
  }

  openDeletePaymentDialog(payment: Payment) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      autoFocus: false,
      data: { name: 'paiement de ' + payment.amountPaid + '€ du ' + moment(payment.createdDate).format('MM/DD/YYYY') }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.paymentService.deletePayment(payment.id)
        .subscribe(
          res => {
            var index = this.paymentHistory.indexOf(payment);
            if (index > -1) {
                this.paymentHistory.splice(index, 1);
            }
          },
          err => console.log(err)
        );
      }
    });
  }

  get payLater() { return this.form.get('payLater'); }
}
