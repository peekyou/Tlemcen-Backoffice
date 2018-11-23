import { NgModule } from '@angular/core';
import { SharedModule } from '../core/shared/shared.module';

import { PaymentsRoutingModule } from './payments-routing.module';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    PaymentsRoutingModule
  ]
})
export class PaymentsModule { }
