import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AirlineListComponent } from './airline-list/airline-list.component';

const routes: Routes = [
  { path: '', component: AirlineListComponent },
  // { path: ':id', component: CustomerDetailComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AirlinesRoutingModule { }
