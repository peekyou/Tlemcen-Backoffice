import { NgModule } from '@angular/core';
import { SharedModule } from '../core/shared/shared.module';

import { ManagementRoutingModule } from './management-routing.module';
import { ManagementComponent } from './management/management.component';

@NgModule({
  declarations: [ManagementComponent],
  imports: [
    SharedModule,
    ManagementRoutingModule
  ]
})
export class ManagementModule { }
