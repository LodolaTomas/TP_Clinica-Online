import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../auth/service/auth.service';
import * as firebase from 'firebase';
import { Paciente } from '../class/paciente/paciente';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private dbPath = '/Pacientes';
  pacienteref:AngularFireList<Paciente>=null;
  pacienteturn:AngularFireList<any>=null;
  paciente:Paciente;
  listaPacientes:Paciente[]=[];
  misturnitos:Array<any>=[]
  constructor(private authSvc: AuthService, private storage: AngularFireStorage,private db:AngularFireDatabase) {
    this.pacienteref=db.list(this.dbPath);
    this.getlistPacientes().then(datos=>{this.listaPacientes=<Array<any>>datos})
  }

  createPaciente(paciente: Paciente): boolean {
    let flag=false;
    try {
      this.authSvc.GetCurrentUser().then((response: any) => {
        var ref = firebase.default.database().ref(this.dbPath);
        var fotoName = paciente.imagen1.name;
        var fotoName2= paciente.imagen2.name;
        let extencion = fotoName.split('.').pop();
        let extencion2 = fotoName2.split('.').pop();
        const filepath1 = `/pacientes/${response.uid}/perfil1.${extencion}`;
        const filepath2= `/pacientes/${response.uid}/perfil2.${extencion2}`;
        const task = this.storage.upload(filepath1, paciente.imagen1).then(() => {
        const task2 = this.storage.upload(filepath2, paciente.imagen2).then(() => {
          let storages = firebase.default.storage();
          let storageRef = storages.ref();
          let spaceRef = storageRef.child(filepath1);
          let spaceRef2 = storageRef.child(filepath2);
          spaceRef.getDownloadURL().then(url => {
            spaceRef2.getDownloadURL().then(url2=>{
              paciente.imagen1= url;
              paciente.imagen2= url2;
            ref.child(`${response.uid}`).set({
              nombre: paciente.nombre,
              apellido: paciente.apellido, 
              edad: paciente.edad,
              dni: paciente.dni,
              email: paciente.email, 
              password: paciente.password,
              obraSocial:paciente.obraSocial,
              imagen1: `${paciente.imagen1}`,
              imagen2: `${paciente.imagen2}`
            })
            })
            
          });
        })
        })
      });
      this.authSvc.LogOutCurrentUser();
      flag=true
    } catch (error) {
      console.log("error",error)
    }
    return flag
  }
  
  getlistPacientes(){
    return new Promise(resolve=>{
      this.pacienteref.snapshotChanges().subscribe(pacientes=>{
        pacientes.forEach((element)=>{
          this.paciente=element.payload.val();
          this.paciente.id=element.key
          this.listaPacientes.push(this.paciente)
        })
        resolve(this.listaPacientes)
      });
    })
  }
  getPacientes(){
    return this.listaPacientes
  }
  getPacienteUID(packey:string) {
    let paciente;
    if(packey!=null)
    packey=packey.replace(/['"]+/g,'')
    this.listaPacientes.forEach((data)=>{
      if(data.id==packey){
        paciente=data;
      }
    })
    return paciente;
  }

  guardarTurno(turno){
      var ref = firebase.default.database().ref().child("/Turnos");
     return  ref.push(turno);
  }
  
}
