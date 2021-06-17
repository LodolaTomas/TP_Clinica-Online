import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistroRoutingModule } from './registro-routing.module';
import { RegistroComponent } from './registro.component';
import { NavBarModule } from '../../nav-bar/nav-bar.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';
@NgModule({
  declarations: [
    RegistroComponent,
  ],
  imports: [
    CommonModule,
    RegistroRoutingModule,
    NavBarModule,
    ReactiveFormsModule,
    NgxCaptchaModule
  ]
})
export class RegistroModule { }
