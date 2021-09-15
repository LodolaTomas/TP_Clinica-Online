import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BienvenidoComponent } from './componentes/bienvenido/bienvenido.component';
import { AngularFireModule } from '@angular/fire';
import {AngularFireStorageModule} from "@angular/fire/storage";
import { NavBarModule } from './componentes/nav-bar/nav-bar.module';
import { LoginComponent } from './componentes/ingreso/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OpcionesRegistroComponent } from './componentes/ingreso/opciones-registro/opciones-registro.component';
import { SeccionUsuariosComponent } from './componentes/seccion-usuarios/seccion-usuarios.component';
import { SeccionPacienteComponent } from './componentes/seccion-paciente/seccion-paciente.component';
import { SeccionEspecialistaComponent } from './componentes/seccion-especialista/seccion-especialista.component';
import { FilterPipe } from './pipe/filter.pipe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialAngularModule } from './modulo/material-angular/material-angular.module';

import { MisHorariosComponent } from './componentes/mis-horarios/mis-horarios.component';
import { LowercasePipe } from './pipe/lowercase.pipe';
import { UppercasePipe } from './pipe/uppercase.pipe';
import { KeysPipe } from './pipe/keys.pipe';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AltaAdminModule } from './componentes/alta-admin/alta-admin.module';
import { NgxCaptchaModule } from 'ngx-captcha';
import { environment } from 'src/environments/environment.prod';
import { SacarTurnoModule } from './componentes/sacar-turno/sacar-turno.module';
import { NgxPrintModule } from 'ngx-print'; 
import { HoverDirective } from './directive/hover.directive';
import { SizerDirective } from './directive/sizer.directive';
import { HistoriaClinicaComponent } from './componentes/historia-clinica/historia-clinica.component';
import { ChartsModule } from 'ng2-charts';
@NgModule({
  declarations: [
    AppComponent,
    BienvenidoComponent,
    LoginComponent,
    OpcionesRegistroComponent,
    SeccionUsuariosComponent,
    SeccionPacienteComponent,
    SeccionEspecialistaComponent,
    FilterPipe,
    MisHorariosComponent,
    LowercasePipe,
    UppercasePipe,
    KeysPipe,
    HoverDirective,
    SizerDirective,
    HistoriaClinicaComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    NavBarModule,
    ReactiveFormsModule,
    FormsModule,
    NoopAnimationsModule,
    MaterialAngularModule,
    NgbModule,
    AltaAdminModule,
    NgxCaptchaModule,
    SacarTurnoModule,
    NgxPrintModule,
    SacarTurnoModule,
    ChartsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  
 }

 
 
