import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { ToasterService } from '../../core/services/toaster.service';
import { ToasterType } from '../../core/models/toaster-type';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  forgetPasswordSubscription: Subscription;
  successMessage: string;
  errorMessage: string;
  email = this.fb.control('', Validators.email);
  form = this.fb.group({
      email: this.email,
  });

  constructor(
      private fb: FormBuilder, 
      private auth: AuthService, 
      private toasterService: ToasterService,
      private translationService: TranslationService,
      private router: Router) { 
          translationService.getMultiple(['AUTH.FORGET_PASSWORD_SUCCESS', 'ERRORS.SERVER_ERROR'], 
            x => {
                this.successMessage = x['AUTH.FORGET_PASSWORD_SUCCESS'];
                this.errorMessage = x['ERRORS.SERVER_ERROR'];
            });
      }

  ngOnInit() {
      if (this.auth.isAuthenticated()) {
          this.router.navigate(['/']);
      }
  }
  
  onSumbit() {
    this.forgetPasswordSubscription = this.auth.forgetPassword(this.email.value)
        .subscribe(result => {
            if (result === true) {
                this.toasterService.showToaster(this.successMessage);
            }
            else {
                this.toasterService.showToaster(this.errorMessage, ToasterType.Error);
            }
        });
  }
}
