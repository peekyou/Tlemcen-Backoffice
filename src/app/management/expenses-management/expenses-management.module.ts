import { NgModule } from '@angular/core';
import { SharedModule } from '../../core/shared/shared.module';
import { ComponentsModule } from '../../components/components.module';

import { ExpensesManagementRoutingModule } from './expenses-management-routing.module';
import { ExpenseCategoryListComponent } from './expense-category-list/expense-category-list.component';

@NgModule({
  declarations: [ExpenseCategoryListComponent],
  imports: [
    SharedModule,
    ComponentsModule,
    ExpensesManagementRoutingModule
  ]
})
export class ExpensesManagementModule { }
