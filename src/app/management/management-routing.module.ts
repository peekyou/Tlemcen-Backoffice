import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagementComponent } from './management/management.component';

const routes: Routes = [
  { path: '',      component: ManagementComponent },
  { path: 'user',           loadChildren: './user-management/user-management.module#UserManagementModule' },
  { path: 'fees',           loadChildren: './fees-management/fees-management.module#FeesManagementModule' },
  { path: 'documents',      loadChildren: './documents-management/documents-management.module#DocumentsManagementModule' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
