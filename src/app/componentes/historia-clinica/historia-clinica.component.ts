import { Component, Input, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.css']
})
export class HistoriaClinicaComponent implements OnInit {
  @Input() paciente: any;
  turnosEspecialista: any;
  turnPorEsp:any;
  constructor() { }

  async ngOnInit() {
    this.turnosEspecialista = await this.listaTurnosEspecialista();
    this.turnPorEsp= this.getHistoriasClincas(this.turnosEspecialista);
    console.log(this.turnPorEsp)
  }

  listaTurnosEspecialista() {
    let turnitos:Array<any>= [];
    return new Promise(resolve => {
      firebase.default.database().ref("/Turnos/").on("value", snapshot => {
        turnitos.splice(0, turnitos.length)
        snapshot.forEach(element => {
          if (element.val().paciente.id == this.paciente.id) {
            if (element.val().estado === "finalizado") {
              turnitos.push(element.val())
            }
          }
        })
        resolve(turnitos)
      })
    })
  }
  getHistoriasClincas(turnos:Array<any>){
    let historiasClinicas:any;
    let historiaEspecialista:Array<any>=[];
    turnos.forEach(element => {
        if(historiaEspecialista.length>0){
          historiaEspecialista.forEach(data=>{
            if(data.especialista.id===element.especialista.id){
              historiasClinicas={'especialidad':element.especialidad,'horario':element.horario,'historiaClininica':element.historiaClinica}
              data.historiasClinicas.push(historiasClinicas)
            }
            if(historiaEspecialista.find(e => e.especialista.id === element.especialista.id)==undefined){
              historiasClinicas={'especialidad':element.especialidad,'horario':element.horario,'historiaClininica':element.historiaClinica}
              historiaEspecialista.push({'especialista':element.especialista,'historiasClinicas':[historiasClinicas]})
            }
          })
        }
        if(historiaEspecialista.length==0){
          console.log('entree')
          historiasClinicas={'especialidad':element.especialidad,'horario':element.horario,'historiaClininica':element.historiaClinica}
          historiaEspecialista.push({'especialista':element.especialista,'historiasClinicas':[historiasClinicas]})
        }
    });
    return historiaEspecialista;
  }


}
