import { NgModule } from '@angular/core';
import { SharedModule } from '../core/shared/shared.module';
import { ComponentsModule } from '../components/components.module';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { CustomerListComponent } from './customer-list/customer-list.component';

@NgModule({
  declarations: [CustomerDetailComponent, CustomerListComponent],
  imports: [
    ComponentsModule,
    SharedModule,
    CustomersRoutingModule
  ]
})
export class CustomersModule { }
