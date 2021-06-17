import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../ingreso/login/login.component';
import { OpcionesRegistroComponent } from '../ingreso/opciones-registro/opciones-registro.component';
import { NavBarComponent } from './nav-bar.component';

const routes: Routes = [
  {path:'', component: NavBarComponent },
  {path:'login',component:LoginComponent},
  {path:'opcionesRegistro',component:OpcionesRegistroComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NavBarRoutingModule { }
