import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OmraListComponent } from './omra-list/omra-list.component';
import { OmraDetailComponent } from './omra-detail/omra-detail.component';
import { OmraRoomsPlanComponent } from './omra-rooms-plan/omra-rooms-plan.component';

const routes: Routes = [
  { path: '', component: OmraListComponent },
  { path: ':id', component: OmraDetailComponent },
  { path: ':id/rooms', component: OmraRoomsPlanComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OmraRoutingModule { }
