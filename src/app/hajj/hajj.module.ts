import { NgModule } from '@angular/core';
import { SharedModule } from '../core/shared/shared.module';
import { ComponentsModule } from '../components/components.module';

import { HajjRoutingModule } from './hajj-routing.module';
import { HajjListComponent } from './hajj-list/hajj-list.component';
import { HajjDetailComponent } from './hajj-detail/hajj-detail.component';
import { HajjRoomsPlanComponent } from './hajj-rooms-plan/hajj-rooms-plan.component';
import { HajjDialogComponent } from './hajj-dialog/hajj-dialog.component';
import { HajjAddCustomersComponent } from './hajj-add-customers/hajj-add-customers.component';
import { HajjFlightsPlanComponent } from './hajj-flights-plan/hajj-flights-plan.component';

@NgModule({
  declarations: [HajjListComponent, HajjDetailComponent, HajjRoomsPlanComponent, HajjDialogComponent, HajjAddCustomersComponent, HajjFlightsPlanComponent],
  imports: [
    SharedModule,
    ComponentsModule,
    HajjRoutingModule,
  ],
  entryComponents: [HajjDialogComponent]
})
export class HajjModule { }
