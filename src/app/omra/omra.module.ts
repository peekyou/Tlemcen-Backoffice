import { NgModule } from '@angular/core';
import { SharedModule } from '../core/shared/shared.module';
import { ComponentsModule } from '../components/components.module';

import { OmraRoutingModule } from './omra-routing.module';
import { OmraDetailComponent } from './omra-detail/omra-detail.component';
import { OmraListComponent } from './omra-list/omra-list.component';
import { OmraRoomsPlanComponent } from './omra-rooms-plan/omra-rooms-plan.component';
import { OmraDialogComponent } from './omra-dialog/omra-dialog.component';
import { OmraAddCustomersComponent } from './omra-add-customers/omra-add-customers.component';

@NgModule({
  declarations: [OmraDetailComponent, OmraListComponent, OmraRoomsPlanComponent, OmraDialogComponent, OmraAddCustomersComponent],
  imports: [
    SharedModule,
    ComponentsModule,
    OmraRoutingModule
  ],
  entryComponents: [OmraDialogComponent]
})
export class OmraModule { }
