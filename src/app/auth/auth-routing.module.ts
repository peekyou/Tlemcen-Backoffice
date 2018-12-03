import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { SetPasswordComponent } from './set-password/set-password.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'set-password', component: SetPasswordComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
