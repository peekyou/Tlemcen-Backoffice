import { NgModule } from '@angular/core';
import { SharedModule } from '../core/shared/shared.module';
import { ComponentsModule } from '../components/components.module';

import { PaymentsRoutingModule } from './payments-routing.module';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';

@NgModule({
  declarations: [PaymentListComponent, PaymentDialogComponent],
  imports: [
    SharedModule,
    ComponentsModule,
    PaymentsRoutingModule
  ],
  entryComponents: [PaymentDialogComponent]
})
export class PaymentsModule { }
