import { NgModule } from '@angular/core';
import { SharedModule } from '../core/shared/shared.module';
import { ComponentsModule } from '../components/components.module';

import { AirlinesRoutingModule } from './airlines-routing.module';
import { AirlineListComponent } from './airline-list/airline-list.component';
import { AirlineDialogComponent } from './airline-dialog/airline-dialog.component';

@NgModule({
  declarations: [AirlineListComponent, AirlineDialogComponent],
  imports: [
    SharedModule,
    ComponentsModule,
    AirlinesRoutingModule
  ],
  entryComponents: [AirlineDialogComponent]
})
export class AirlinesModule { }
