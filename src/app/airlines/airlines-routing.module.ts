import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AirlineListComponent } from './airline-list/airline-list.component';
import { PermissionGuard } from '../core/guards/permission.guard';
import { AuthGuard } from '../core/guards/auth.guard';
import { Permissions } from '../auth/permissions';

const routes: Routes = [
  { 
    path: '',
    component: AirlineListComponent,
    data: { permissions: [Permissions.AirlineList, Permissions.AirlineGet, Permissions.AirlineCreate, Permissions.AirlineDelete, Permissions.AirlineUpdate] },
    canActivate: [AuthGuard, PermissionGuard]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AirlinesRoutingModule { }
