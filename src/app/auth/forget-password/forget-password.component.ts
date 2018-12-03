import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  forgetPasswordSubscription: Subscription;
  error: boolean;
  email = this.fb.control('', Validators.email);
  form = this.fb.group({
      email: this.email,
  });

  constructor(
      private fb: FormBuilder, 
      private auth: AuthService, 
      private router: Router) { }

  ngOnInit() {
      if (this.auth.isAuthenticated()) {
          this.router.navigate(['/']);
      }
  }
  
  onSumbit() {
      this.forgetPasswordSubscription = this.auth.forgetPassword(this.email.value)
          .subscribe(result => {
              this.error = !result;
          },
          err => {
              console.log(err);
              this.error = true;
          });
  }
}
