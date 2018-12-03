import { NgModule } from '@angular/core';
import { SharedModule } from '../core/shared/shared.module';
import { ComponentsModule } from '../components/components.module';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';

@NgModule({
  declarations: [LoginComponent, SetPasswordComponent, ForgetPasswordComponent],
  imports: [
    SharedModule,
    ComponentsModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
