import { NgModule } from '@angular/core';
import { WebcamModule } from 'ngx-webcam';
import { DragulaModule } from 'ng2-dragula';
import { SharedModule } from '../core/shared/shared.module';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UserPopoverComponent } from './navbar/popover/user-popover.component'
import { SidebarComponent } from './sidebar/sidebar.component';
import { CustomerFormComponent } from './customers/customer-form/customer-form.component';
import { FileUploadComponent } from './common/file-upload/file-upload.component';
import { WebcamComponent } from './webcam/webcam.component';
import { RoomsAssignmentComponent } from './hotels/rooms-assignment/rooms-assignment.component';
import { SearchCustomerDialogComponent } from './customers/search-customer-dialog/search-customer-dialog.component';
import { CustomerDialogComponent } from './customers/customer-dialog/customer-dialog.component';
import { UploadDocumentsComponent } from './upload-documents/upload-documents.component';
import { PaymentComponent } from './payment/payment.component';
import { HotelRoomsDialogComponent } from './hotels/hotel-rooms-dialog/hotel-rooms-dialog.component';
import { SubmitButtonComponent } from './common/submit-button/submit-button.component';
import { ErrorMessageComponent } from './common/error-message/error-message.component';
import { DeleteDialogComponent } from './common/delete-dialog/delete-dialog.component';
import { ConfirmationDialogComponent } from './common/confirmation-dialog/confirmation-dialog.component';
import { SpinnerComponent } from './common/spinner/spinner.component';
import { TravelServicesComponent } from './travels/travel-services/travel-services.component';
import { CustomerTravelComponent } from './customers/customer-travel/customer-travel.component';
import { FlightBookingComponent } from './airlines/flight-booking/flight-booking.component';
import { FlightBookingDialogComponent } from './airlines/flight-booking-dialog/flight-booking-dialog.component';
import { TravelDetailComponent } from './travels/travel-detail/travel-detail.component';
import { PrintDocumentsDialogComponent } from './travels/print-documents-dialog/print-documents-dialog.component';
import { CircleProgressComponent } from './common/circle-progress/circle-progress.component';
import { FlightsAssignmentComponent } from './airlines/flights-assignment/flights-assignment.component';
import { FlightDetailComponent } from './airlines/flight-detail/flight-detail.component';

const MODALS = [
  CustomerDialogComponent,
  SearchCustomerDialogComponent,
  HotelRoomsDialogComponent,
  DeleteDialogComponent,
  ConfirmationDialogComponent,
  FlightBookingDialogComponent,
  PrintDocumentsDialogComponent,
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
    UserPopoverComponent,
    SidebarComponent,
    CustomerFormComponent,
    FileUploadComponent,
    WebcamComponent,
    RoomsAssignmentComponent,
    SubmitButtonComponent,
    ErrorMessageComponent,
    SpinnerComponent,
    UploadDocumentsComponent,
    PaymentComponent,
    TravelServicesComponent,
    CustomerTravelComponent,
    FlightBookingComponent,
    TravelDetailComponent,
    CircleProgressComponent,
    FlightsAssignmentComponent,
    FlightDetailComponent,
    ...MODALS,
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    CustomerFormComponent,
    FileUploadComponent,
    RoomsAssignmentComponent,
    SubmitButtonComponent,
    ErrorMessageComponent,
    SpinnerComponent,
    UploadDocumentsComponent,
    PaymentComponent,
    TravelServicesComponent,
    CustomerTravelComponent,
    FlightBookingComponent,
    TravelDetailComponent,
    CircleProgressComponent,
    FlightsAssignmentComponent,
    FlightDetailComponent,
    ...MODALS
  ],
  entryComponents: MODALS
})
export class ComponentsModule { }
