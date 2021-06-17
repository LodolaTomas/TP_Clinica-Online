import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SacarTurnoRoutingModule } from './sacar-turno-routing.module';
import { SacarTurnoComponent } from './sacar-turno.component';
import { NavBarModule } from '../nav-bar/nav-bar.module';
import { FormsModule } from '@angular/forms';
import { OctavioPipe } from 'src/app/pipe/octavio.pipe';
import { BuscadorPipe } from 'src/app/pipe/buscador.pipe';
import { AgrandarDirective } from 'src/app/directive/agrandar.directive';


@NgModule({
  declarations: [
    SacarTurnoComponent,
    OctavioPipe,
    BuscadorPipe,
    AgrandarDirective
  ],
  imports: [
    CommonModule,
    SacarTurnoRoutingModule,
    NavBarModule,
    FormsModule
  ],
  exports:[
    SacarTurnoComponent
  ]
})
export class SacarTurnoModule { }
