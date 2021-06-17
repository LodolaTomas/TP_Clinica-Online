import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AltaAdminRoutingModule } from './alta-admin-routing.module';
import { AltaAdminComponent } from './alta-admin.component';

import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AltaAdminComponent
  ],
  imports: [
    CommonModule,
    AltaAdminRoutingModule,
    ReactiveFormsModule,
  ],
  exports:[
    AltaAdminComponent,
  ]
})
export class AltaAdminModule { }
