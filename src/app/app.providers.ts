import { HttpService } from './core/services/http.service';
import { AuthHttpService } from './core/services/auth-http.service';
import { TranslationService } from './core/services/translation.service';
import { LookupService } from './core/services/lookup.service';
import { AuthService } from './auth/auth.service';
import { CustomersService } from './customers/customers.service';
import { HajjService } from './hajj/hajj.service';
import { OmraService } from './omra/omra.service';
import { AirlinesService } from './airlines/airlines.service';
import { HotelsService } from './hotels/hotels.service';
import { PaymentService } from './payments/payment.service';

import { AuthGuard } from './core/guards/auth.guard';
import { PermissionGuard } from './core/guards/permission.guard';

export const APP_PROVIDERS = [
    HttpService,
    AuthHttpService,
    TranslationService,
    LookupService,
    AuthService,
    CustomersService,
    HajjService,
    OmraService,
    AirlinesService,
    HotelsService,
    PaymentService,
    AuthGuard,
    PermissionGuard
];