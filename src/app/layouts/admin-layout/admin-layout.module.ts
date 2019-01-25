import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../core/shared/shared.module';
import { ComponentsModule } from '../../components/components.module';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';

@NgModule({
  imports: [
    SharedModule,
    ComponentsModule,
    RouterModule.forChild(AdminLayoutRoutes),
  ],
  declarations: [
    DashboardComponent
  ]
})

export class AdminLayoutModule {}
