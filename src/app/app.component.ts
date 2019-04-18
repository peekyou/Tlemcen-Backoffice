import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(
    translate: TranslateService,
    private authService: AuthService, 
    private router: Router) {

        translate.setDefaultLang('fr');
        translate.use('fr');
        moment.locale('fr');
  }

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
        this.router.navigate(['/auth']);
    }
  }
}
