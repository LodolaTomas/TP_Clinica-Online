import { Component, OnInit } from '@angular/core';
import { Paciente } from 'src/app/class/paciente/paciente';
import { EspecialistasService } from 'src/app/services/especialistas.service';
import { PacienteService } from 'src/app/services/paciente.service';
import Swal from 'sweetalert2';
import * as firebase from 'firebase';
@Component({
  selector: 'app-sacar-turno',
  templateUrl: './sacar-turno.component.html',
  styleUrls: ['./sacar-turno.component.scss']
})
export class SacarTurnoComponent implements OnInit {
  paciente: Paciente=new Paciente();
  uid:any;
  listaespecialista: Array<any>;
  espSeleccionado;
  listaFiltrada: Array<any> = [];
  horariosEsp: any = '';
  flagturno = false;
  listaTurno: any[] = [];
  selecEspecialidad;
  misTurnos:any[]=[];
  unoconhistorias=false
  listaespespe:any[]=[]
  esp:any={}
  
  constructor(private espSrv: EspecialistasService,private pacSrv: PacienteService) { 
    this.listaespespe = espSrv.returnEspEsp();
  }
  filterPost='';
  ngOnInit(): void {
    this.uid = JSON.parse(localStorage.getItem('uid'));
    firebase.default.database().ref(`/Pacientes/${this.uid}`).on("value",snapshot=>{
      this.paciente=<Paciente>snapshot.val();
      this.paciente.id=snapshot.key;
    })
    firebase.default.database().ref("/Turnos/").on("value",snapshot=>{
      this.misTurnos.splice(0,this.misTurnos.length)
      var turncompleto;
      snapshot.forEach(element=>{
        if(element.val().paciente.id==this.paciente.id){
          turncompleto=element.val()
          turncompleto.id=element.key
          turncompleto.estado=='finalizado'?this.unoconhistorias=true:''
          this.misTurnos.push(turncompleto)
        }
      })
    })
    
  }
  
  turnosEspecialista(item) {
    this.selecEspecialidad = item.especialidad
    this.espSeleccionado = item;
    this.espSrv.getHorarios(item).then((dato) => {
      this.horariosEsp = dato;
      this.listarTurnos()
    })

  }

  sacarTurno(diaSeleccionado) {
    var turnoSeleccionado = { 'paciente': this.paciente, 'especialista': this.espSeleccionado, 'horario': diaSeleccionado, 'especialidad': this.selecEspecialidad,'estado':'pendiente' };
    this.pacSrv.guardarTurno(turnoSeleccionado).then((dato) => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Turno Obtenido con Exito',
        showConfirmButton: false,
        timer: 1500
      })
    })
  }
  listarTurnos() {
    let hoy = new Date()
    let dia = new Date()
    let maniana = new Date()
    this.listaTurno = [];
    let diasActivo;
    let duracionTurno = 30;
    diasActivo = this.horariosEsp.horarios;
    let ultimoTurno
    for (let contador = 1; contador <= 15; contador++) {
      if (diasActivo.indexOf(dia.getDay()) !== -1) {
        ultimoTurno = dia
        ultimoTurno.setHours(19, 0)
        if (dia.getDay() == 6) {
          ultimoTurno.setHours(14, 0)
        }
        ultimoTurno = new Date(ultimoTurno.getTime() - duracionTurno * 60000)
        dia.setHours(8, 0);//prmer turno
        do {
          /* "14/6/2021 08:00:06" */
          this.listaTurno.push(dia.toLocaleString([], { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }));
          dia = new Date(dia.getTime() + duracionTurno * 60000)
        } while (dia <= ultimoTurno);
      }
      maniana.setDate(hoy.getDate() + contador)
      dia = maniana
    }
  }
}
