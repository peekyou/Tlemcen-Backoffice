import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpenseCategoryListComponent } from './expense-category-list/expense-category-list.component';

const routes: Routes = [
  { path: '', component: ExpenseCategoryListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpensesManagementRoutingModule { }