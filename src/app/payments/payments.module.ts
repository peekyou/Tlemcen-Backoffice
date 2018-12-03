import { NgModule } from '@angular/core';
import { SharedModule } from '../core/shared/shared.module';

import { PaymentsRoutingModule } from './payments-routing.module';
import { PaymentListComponent } from './payment-list/payment-list.component';

@NgModule({
  declarations: [PaymentListComponent],
  imports: [
    SharedModule,
    PaymentsRoutingModule
  ]
})
export class PaymentsModule { }
