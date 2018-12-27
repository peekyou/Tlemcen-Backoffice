import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Customer } from '../../customers/customer.model';
import { Payment } from '../../payments/payment.model';
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
  
  @Input() fees: Fee[];
  @Input() customer: Customer;
  @Input() travel;
  @Output() onChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private feeService: FeeService) {

  }

  ngOnInit() {
    this.form = this.fb.group({
      amount: [null, Validators.required],
      discount: [null]
    });

    this.form.valueChanges.subscribe(data => {
      this.onChange.emit(this.getPayment());
    });
  }

  getPayment(): Payment {
    var totalAmount = this.calculateTotal();
    var payment: Payment = {
      amountPaid: this.form.value.amount,
      discount: this.form.value.discount,
      customer: this.customer,
      amount: totalAmount,
      status: (this.form.value.amount + this.form.value.discount) == totalAmount ? 'P' : 'I'
    };
    return payment;
  }

  calculateTotal() {
    return this.fees.reduce(function(a, b){
      return a + b.price;
    }, 0);
  }

  getAmountToPay() {
    var totalAmount = this.calculateTotal();
    var discount = this.form.value.discount;
    if (!discount) {
      return totalAmount;
    }
    return Math.max(0, totalAmount - discount);
  }
}
