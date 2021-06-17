import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavBarRoutingModule } from './nav-bar-routing.module';
import { NavBarComponent } from './nav-bar.component';
import { MaterialAngularModule } from 'src/app/modulo/material-angular/material-angular.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    NavBarComponent,
  ],
  imports: [
    CommonModule,
    NavBarRoutingModule,
    MaterialAngularModule
  ],
  exports:[
    NavBarComponent,
  ]
})
export class NavBarModule { }
