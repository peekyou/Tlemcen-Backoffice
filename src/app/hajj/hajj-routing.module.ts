import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HajjListComponent } from './hajj-list/hajj-list.component';
import { HajjDetailComponent } from './hajj-detail/hajj-detail.component';
import { HajjRoomsPlanComponent } from './hajj-rooms-plan/hajj-rooms-plan.component';
import { HajjAddCustomersComponent } from './hajj-add-customers/hajj-add-customers.component';

const routes: Routes = [
  { path: '', component: HajjListComponent },
  { path: ':id', component: HajjDetailComponent },
  { path: ':id/rooms', component: HajjRoomsPlanComponent },
  { path: ':id/customers', component: HajjAddCustomersComponent },
  { path: ':id/customers/:customerId', component: HajjAddCustomersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HajjRoutingModule { }
