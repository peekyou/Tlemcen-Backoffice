import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeeListComponent } from './fee-list/fee-list.component';

const routes: Routes = [
  { path: '', component: FeeListComponent }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeesManagementRoutingModule { }
