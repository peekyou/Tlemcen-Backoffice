import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HajjListComponent } from './hajj-list/hajj-list.component';
import { HajjDetailComponent } from './hajj-detail/hajj-detail.component';
import { HajjRoomsPlanComponent } from './hajj-rooms-plan/hajj-rooms-plan.component';

const routes: Routes = [
  { path: '', component: HajjListComponent },
  { path: ':id', component: HajjDetailComponent },
  { path: ':id/rooms', component: HajjRoomsPlanComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HajjRoutingModule { }
