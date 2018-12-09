import { NgModule } from '@angular/core';
import { SharedModule } from '../../core/shared/shared.module';
import { ComponentsModule } from '../../components/components.module';

import { FeesManagementRoutingModule } from './fees-management-routing.module';
import { FeeListComponent } from './fee-list/fee-list.component';

@NgModule({
  declarations: [FeeListComponent],
  imports: [
    SharedModule,
    ComponentsModule,
    FeesManagementRoutingModule
  ]
})
export class FeesManagementModule { }
