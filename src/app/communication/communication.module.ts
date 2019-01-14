import { NgModule } from '@angular/core';
import { SharedModule } from '../core/shared/shared.module';
import { ComponentsModule } from '../components/components.module';

import { CommunicationRoutingModule } from './communication-routing.module';
import { CommunicationDashboardComponent } from './communication-dashboard/communication-dashboard.component';
import { SmsComponent } from './sms/sms.component';
import { SmsListComponent } from './sms/sms-list/sms-list.component';
import { SmsInfoComponent } from './sms/sms-new/sms-info/sms-info.component';
import { SmsFilterComponent } from './sms/sms-new/sms-filter/sms-filter.component';
import { SmsPackDialogComponent } from './sms/sms-pack-dialog/sms-pack-dialog.component';

@NgModule({
  declarations: [CommunicationDashboardComponent, SmsComponent, SmsListComponent, SmsInfoComponent, SmsFilterComponent, SmsPackDialogComponent],
  imports: [
    SharedModule,
    ComponentsModule,
    CommunicationRoutingModule
  ],
  entryComponents: [SmsPackDialogComponent]
})
export class CommunicationModule { }
