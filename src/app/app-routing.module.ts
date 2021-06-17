import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidoComponent } from './componentes/bienvenido/bienvenido.component';
import { MisHorariosComponent } from './componentes/mis-horarios/mis-horarios.component';
import { SeccionEspecialistaComponent } from './componentes/seccion-especialista/seccion-especialista.component';
import { SeccionPacienteComponent } from './componentes/seccion-paciente/seccion-paciente.component';
import { SeccionUsuariosComponent } from './componentes/seccion-usuarios/seccion-usuarios.component';

const routes: Routes = [
  {path:'bienvenido',component:BienvenidoComponent},
  {path:'',redirectTo:'bienvenido',pathMatch:'full'},
  {
    path: 'ingreso/registerPaciente',
    loadChildren: () => import('./componentes/ingreso/registro/registro.module').then( m => m.RegistroModule)
  },
  {
    path: 'ingreso/registerEspecialista',
    loadChildren: () => import('./componentes/ingreso/registro/registro.module').then( m => m.RegistroModule)
  },
  {path:'seccionUsuarios',component:SeccionUsuariosComponent},
  {path:'seccionPaciente',component:SeccionPacienteComponent},
  {path:'seccionEspecialista',component:SeccionEspecialistaComponent},
  { path: 'sacarTurno', loadChildren: () => import('./componentes/sacar-turno/sacar-turno.module').then(m => m.SacarTurnoModule) },
  {path:'mishorarios',component:MisHorariosComponent},
  { path: 'altaAdmin', loadChildren: () => import('./componentes/alta-admin/alta-admin.module').then(m => m.AltaAdminModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
