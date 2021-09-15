import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import * as firebase from 'firebase';
import { Turnos } from '../class/turnos/turnos';
@Injectable({
  providedIn: 'root'
})
export class TurnosService {
  private dbPath = '/Turnos';
  esperef: AngularFireList<any> = null;
  constructor(private db: AngularFireDatabase) {
    this.esperef = db.list(this.dbPath)
   }

  algo(){
    return this.esperef
  }
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
    return new Promise(resolve=>{
      let misTurnos:Array<any>=[]
      firebase.default.database().ref("/Turnos/").on("value",snapshot=>{
        var turno;
        misTurnos.splice(0,misTurnos.length)
        snapshot.forEach(element=>{
            turno=element.val()
            turno.id=element.key
            misTurnos.push(turno)
        })
      })
       resolve(misTurnos)
    })
  }
}


