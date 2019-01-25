import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AirlineListComponent } from './airline-list/airline-list.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { Permissions } from '../auth/permissions';

const routes: Routes = [
  { 
    path: '',
    component: AirlineListComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AirlinesRoutingModule { }
