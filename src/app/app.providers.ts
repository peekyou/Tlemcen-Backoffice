import { HttpService } from './core/services/http.service';
import { AuthHttpService } from './core/services/auth-http.service';
import { TranslationService } from './core/services/translation.service';
import { LookupService } from './core/services/lookup.service';
import { CustomersService } from './customers/customers.service';
import { HajjService } from './hajj/hajj.service';
import { AirlinesService } from './airlines/airlines.service';
import { HotelsService } from './hotels/hotels.service';

export const APP_PROVIDERS = [
    HttpService,
    AuthHttpService,
    TranslationService,
    LookupService,
    CustomersService,
    HajjService,
    AirlinesService,
    HotelsService
];