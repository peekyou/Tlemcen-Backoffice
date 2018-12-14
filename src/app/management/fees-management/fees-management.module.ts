import { NgModule } from '@angular/core';
import { SharedModule } from '../../core/shared/shared.module';
import { ComponentsModule } from '../../components/components.module';

import { FeesManagementRoutingModule } from './fees-management-routing.module';
import { FeeListComponent } from './fee-list/fee-list.component';
import { ServiceFeeDialogComponent } from './service-fee-dialog/service-fee-dialog.component';

@NgModule({
  declarations: [FeeListComponent, ServiceFeeDialogComponent],
  imports: [
    SharedModule,
    ComponentsModule,
    FeesManagementRoutingModule
  ],
  entryComponents: [ServiceFeeDialogComponent]
})
export class FeesManagementModule { }
