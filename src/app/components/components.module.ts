import { NgModule } from '@angular/core';
import { WebcamModule } from 'ngx-webcam';
import { DragulaModule } from 'ng2-dragula';
import { SharedModule } from '../core/shared/shared.module';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CustomerFormComponent } from './customers/customer-form/customer-form.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { WebcamComponent } from './webcam/webcam.component';
import { RoomsAssignmentComponent } from './hotels/rooms-assignment/rooms-assignment.component';
import { SearchCustomerDialogComponent } from './customers/search-customer-dialog/search-customer-dialog.component';
import { CustomerDialogComponent } from './customers/customer-dialog/customer-dialog.component';
import { UploadDocumentsDialogComponent } from './upload-documents-dialog/upload-documents-dialog.component';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';
import { HotelRoomsDialogComponent } from './hotels/hotel-rooms-dialog/hotel-rooms-dialog.component';

const MODALS = [
  CustomerDialogComponent,
  SearchCustomerDialogComponent,
  UploadDocumentsDialogComponent,
  PaymentDialogComponent,
  HotelRoomsDialogComponent
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
    ...MODALS,
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
