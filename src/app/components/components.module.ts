import { NgModule } from '@angular/core';
import { WebcamModule } from 'ngx-webcam';
import { DragulaModule } from 'ng2-dragula';
import { SharedModule } from '../core/shared/shared.module';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { WebcamComponent } from './webcam/webcam.component';
import { RoomsAssignmentComponent } from './rooms-assignment/rooms-assignment.component';
import { SearchCustomerDialogComponent } from './search-customer-dialog/search-customer-dialog.component';
import { CustomerDialogComponent } from './customer-dialog/customer-dialog.component';

const MODALS = [
  CustomerDialogComponent,
  SearchCustomerDialogComponent
];

@NgModule({
  imports: [
    SharedModule,
    WebcamModule,
    DragulaModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    CustomerFormComponent,
    FileUploadComponent,
    WebcamComponent,
    RoomsAssignmentComponent,
    ...MODALS
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    CustomerFormComponent,
    FileUploadComponent,
    RoomsAssignmentComponent,
    ...MODALS
  ],
  entryComponents: MODALS
})
export class ComponentsModule { }
