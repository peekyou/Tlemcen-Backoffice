import { NgModule } from '@angular/core';
import { SharedModule } from '../core/shared/shared.module';
import { ComponentsModule } from '../components/components.module';

import { HajjRoutingModule } from './hajj-routing.module';
import { HajjListComponent } from './hajj-list/hajj-list.component';
import { HajjDetailComponent } from './hajj-detail/hajj-detail.component';
import { HajjRoomsPlanComponent } from './hajj-rooms-plan/hajj-rooms-plan.component';
import { HajjNewComponent } from './hajj-new/hajj-new.component';

@NgModule({
  declarations: [HajjListComponent, HajjDetailComponent, HajjRoomsPlanComponent, HajjNewComponent],
  imports: [
    SharedModule,
    ComponentsModule,
    HajjRoutingModule,
  ]
})
export class HajjModule { }
