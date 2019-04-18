import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OmraListComponent } from './omra-list/omra-list.component';
import { OmraDetailComponent } from './omra-detail/omra-detail.component';
import { OmraRoomsPlanComponent } from './omra-rooms-plan/omra-rooms-plan.component';
import { OmraFlightsPlanComponent } from './omra-flights-plan/omra-flights-plan.component';
import { OmraAddCustomersComponent } from './omra-add-customers/omra-add-customers.component';

const routes: Routes = [
  { path: '', component: OmraListComponent },
  { path: ':id', component: OmraDetailComponent },
  { path: ':id/rooms', component: OmraRoomsPlanComponent },
  { path: ':id/flights/:flightId', component: OmraFlightsPlanComponent },
  { path: ':id/customers', component: OmraAddCustomersComponent },
  { path: ':id/customers/:customerId', component: OmraAddCustomersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OmraRoutingModule { }
