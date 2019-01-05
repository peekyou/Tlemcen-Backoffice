import { Component} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(translate: TranslateService) {
        translate.setDefaultLang('fr');
        translate.use('fr');
        moment.locale('fr');
    }
}
