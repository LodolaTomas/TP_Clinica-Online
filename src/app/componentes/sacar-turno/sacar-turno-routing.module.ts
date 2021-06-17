import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SacarTurnoComponent } from './sacar-turno.component';

const routes: Routes = [{ path: '', component: SacarTurnoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SacarTurnoRoutingModule { }
