import { NgModule } from '@angular/core';
import { SharedModule } from '../core/shared/shared.module';
import { ComponentsModule } from '../components/components.module';

import { AccountingRoutingModule } from './accounting-routing.module';
import { AccountingComponent } from './accounting/accounting.component';
import { ExpenseDialogComponent } from './expense-dialog/expense-dialog.component';

@NgModule({
  declarations: [AccountingComponent, ExpenseDialogComponent],
  imports: [
    SharedModule,
    ComponentsModule,
    AccountingRoutingModule
  ],
  entryComponents: [ExpenseDialogComponent]
})
export class AccountingModule { }
