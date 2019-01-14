import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommunicationDashboardComponent } from './communication-dashboard/communication-dashboard.component';
import { SmsComponent } from './sms/sms.component';

const routes: Routes = [
  { path: '', component: CommunicationDashboardComponent },
  { path: 'sms', component: SmsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunicationRoutingModule { }
