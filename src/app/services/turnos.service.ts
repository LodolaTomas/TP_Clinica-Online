import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Turnos } from '../class/turnos/turnos';
@Injectable({
  providedIn: 'root'
})
export class TurnosService {
  misTurnos:any[]=[];
  constructor() { }

  aceptarTurno(cambios:Turnos){
    console.log(cambios)
    firebase.default.database().ref().child(`/Turnos/${cambios.id}`).update({estado:cambios.respuesta});
  }
  rechazarTurno(cambios:Turnos){
    firebase.default.database().ref().child(`/Turnos/${cambios.id}`).update({estado:cambios.respuesta,comentario:cambios.comentarios});
  }
  finalizar(cambios:any){
    firebase.default.database().ref().child(`/Turnos/${cambios.id}`).update({estado:cambios.respuesta,historiaClinica:cambios.historialClinica});
  }
  verHistorialClinico(cambios:any){
    var historiaPaciente
    firebase.default.database().ref().child(`/Turnos/${cambios.id}`).child('historiaClinica').on("value",data=>{
      historiaPaciente=data.val()
    })
    return historiaPaciente;
  }
  getAllTurns(){
    firebase.default.database().ref("/Turnos/").on("value",snapshot=>{
      var turno;
      this.misTurnos.splice(0,this.misTurnos.length)
      snapshot.forEach(element=>{
          turno=element.val()
          turno.id=element.key
          this.misTurnos.push(turno)
      })
    })
    return this.misTurnos
  }
}


