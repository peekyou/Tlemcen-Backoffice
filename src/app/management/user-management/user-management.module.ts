import { NgModule } from '@angular/core';
import { SharedModule } from '../../core/shared/shared.module';
import { ComponentsModule } from '../../components/components.module';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserDialogComponent } from './user-dialog/user-dialog.component';

@NgModule({
  declarations: [UserListComponent, UserDialogComponent],
  imports: [
    SharedModule,
    ComponentsModule,
    UserManagementRoutingModule
  ],
  entryComponents: [UserDialogComponent]
})
export class UserManagementModule { }
