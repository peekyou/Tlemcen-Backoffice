import { NgModule } from '@angular/core';
import { SharedModule } from '../core/shared/shared.module';
import { ComponentsModule } from '../components/components.module';

import { AirlinesRoutingModule } from './airlines-routing.module';
import { AirlineListComponent } from './airline-list/airline-list.component';

@NgModule({
  declarations: [AirlineListComponent],
  imports: [
    SharedModule,
    ComponentsModule,
    AirlinesRoutingModule
  ]
})
export class AirlinesModule { }
