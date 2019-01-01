import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { CustomerDetail } from '../../customers/customer-detail.model';
import { Payment } from '../../payments/payment.model';
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
  isEdit = false;
  _customer: CustomerDetail = {};
  
  @Input() 
  set customer(customer: CustomerDetail) {
    this._customer = customer;
    if (this.form) {
      this.form.reset();
    }  
  }
  get customer(): CustomerDetail {
      return this._customer;
  }

  @Input() fees: Fee[];
  @Input() travel: Travel;
  @Output() onChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private feeService: FeeService) {
  }

  ngOnInit() {
    this.isEdit = this._customer != null && this._customer.payments != null && this._customer.payments.length > 0;
    if (this.isEdit) {
      this.sumCustomerPayments();
    }
    
    if (!this.fees) {
      this.fees = [];
    }

    if (this.travel) {
      this.fees.unshift({
        name: this.travel.travelTypeId == TravelType.Hajj ? 'Hajj ' + this.travel.name : this.travel.name,
        price: this.travel.unitPrice,
        isServiceFee: false,
        isMandatoryFee: true
      });
    }

    this.form = this.fb.group({
      amount: [null, Validators.required],
      discount: [null]
    });

    this.form.valueChanges.subscribe(data => {
      this.emitChanges();
    });

    // Emit empty payment in case there is no change in the form before sending
    this.emitChanges();
  }

  sumCustomerPayments() {
    this._customer.travelPayment = new Payment();
    this._customer.payments.forEach(p => {
      // The latest payment is the current one
      this._customer.travelPayment.amount = this._customer.travelPayment.amount;
      this._customer.travelPayment.discount += p.discount;
      this._customer.travelPayment.amountPaid += p.amountPaid;
    });
  }

  emitChanges() {
    this.onChange.emit(this.getPayment());
  }

  getPayment(): Payment {
    var totalAmount = this.calculateTotal();

    // If edit mode, the previsous discount is included in the total for display purpose
    // We need to remove it for saving in DB
    if (this.isEdit && this._customer.travelPayment) {
      totalAmount += this._customer.travelPayment.discount;
    }

    var payment: Payment = {
      amountPaid: this.form.value.amount,
      discount: this.form.value.discount,
      amount: totalAmount
    };
    return payment;
  }

  calculateTotal() {
    var total = this.fees.reduce(function(a, b){
      return a + b.price;
    }, 0);

    if (this.isEdit && this._customer.travelPayment.discount) {
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

    if (this.isEdit && this._customer.travelPayment.amountPaid) {
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
}
