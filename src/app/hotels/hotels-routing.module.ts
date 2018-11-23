import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HotelListComponent } from './hotel-list/hotel-list.component';

const routes: Routes = [
  { path: '', component: HotelListComponent },
  // { path: ':id', component: CustomerDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotelsRoutingModule { }
