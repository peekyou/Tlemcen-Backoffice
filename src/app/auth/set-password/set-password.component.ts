import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { ToasterService } from '../../core/services/toaster.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
    selector: 'app-set-password',
    templateUrl: './set-password.component.html',
    styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit {    
    setPasswordSubscription: Subscription;
    token: string;
    code: string;
    successMessage: string;
    password = this.fb.control('', Validators.minLength(8));
    passwordConfirmation = this.fb.control('', Validators.minLength(8));
    
    form = this.fb.group({
        password: this.password,
        passwordConfirmation: this.passwordConfirmation
    }, { validator: this.areEqual('password', 'passwordConfirmation') });

    constructor(
      private fb: FormBuilder, 
      private service: AuthService,
      private toasterService: ToasterService,
      private translationService: TranslationService,
      private router: Router,
      private activatedRoute: ActivatedRoute) {

        translationService.get('AUTH.REDIRECT_MESSAGE', x => this.successMessage = x);
    }

    ngOnInit() {
        if (this.service.isAuthenticated()) {
            this.router.navigate(['/']);
        }
        else { 
            this.activatedRoute.queryParams.subscribe((params: Params) => {
                this.token = params['token'];
                this.code = params['c'];
            }); 
        }
    }
    
    areEqual(field1: string, field2: string) {
        return (group: FormGroup): { [key: string]: any } => {
            let f1 = group.controls[field1];
            let f2 = group.controls[field2];
            if (f1.value && f2.value && f1.value !== f2.value) {
                return {
                    passwords: "Les mots de passe doivent être identiques"
                };
            }
            return {};
        }
    }

    onSumbit() {
      this.setPasswordSubscription = this.service.setPassword(this.password.value, this.token, this.code)
        .subscribe(result => {
          this.toasterService.showToaster(this.successMessage);
          setTimeout(()=> {       
            this.router.navigate(['/auth']);
          }, 4500);
        });
    }
}