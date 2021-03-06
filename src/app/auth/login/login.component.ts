import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginSubscription: Subscription;
  username = this.fb.control('', Validators.required);
  password = this.fb.control('', Validators.required);

  form = this.fb.group({
      username: this.username,
      password: this.password
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
  
  login() {
      this.loginSubscription = this.auth.login(this.username.value, this.password.value)
          .subscribe(result => {
              if (result === true) {
                  this.router.navigate(['/']);
              }
          },
          err => {
              console.log(err);
          });
  }
}