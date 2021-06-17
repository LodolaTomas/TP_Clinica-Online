import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AltaAdminComponent } from './alta-admin.component';

const routes: Routes = [{ path: '', component: AltaAdminComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AltaAdminRoutingModule { }
