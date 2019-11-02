import { HttpService } from './core/services/http.service';
import { AuthHttpService } from './core/services/auth-http.service';
import { TranslationService } from './core/services/translation.service';
import { LookupService } from './core/services/lookup.service';
import { ToasterService } from './core/services/toaster.service';
import { DemoService } from './core/services/demo.service';
import { AuthService } from './auth/auth.service';
import { DashboardService } from './dashboard/dashboard.service';
import { CustomersService } from './customers/customers.service';
import { HajjService } from './hajj/hajj.service';
import { OmraService } from './omra/omra.service';
import { TravelService } from './travels/travel.service';
import { AirlinesService } from './airlines/airlines.service';
import { HotelsService } from './hotels/hotels.service';
import { PaymentService } from './payments/payment.service';
import { UserService } from './management/user-management/user.service';
import { FeeService } from './management/fees-management/fee.service';
import { DocumentService } from './management/documents-management/document.service';
import { CustomersTravelService } from './components/customers/customer-travel/customers-travel.service';
import { SmsService } from './communication/sms/sms.service';
import { NoteService } from './notes/note.service';
import { AccountingService } from './accounting/accounting.service';


import { AuthGuard } from './core/guards/auth.guard';
import { PermissionGuard } from './core/guards/permission.guard';
import { RoleGuard } from './core/guards/role.guard';

export const APP_PROVIDERS = [
    HttpService,
    AuthHttpService,
    TranslationService,
    LookupService,
    ToasterService,
    AuthService,
    DemoService,
    DashboardService,
    CustomersService,
    HajjService,
    OmraService,
    TravelService,
    AirlinesService,
    HotelsService,
    PaymentService,
    UserService,
    FeeService,
    DocumentService,
    CustomersTravelService,
    SmsService,
    NoteService,
    AccountingService,
    AuthGuard,
    PermissionGuard,
    RoleGuard
];