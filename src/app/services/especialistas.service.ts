import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Especialista } from '../class/especialista/especialista';
import { AuthService } from '../auth/service/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import {LowercasePipe} from '../pipe/lowercase.pipe';
@Injectable({
  providedIn: 'root'
})
export class EspecialistasService {
  private dbPath = '/Especialista';
  private dbPath2 = '/Especialidades';
   tolower = new LowercasePipe()
  esperef: AngularFireList<Especialista> = null;
  especialidadesref: AngularFireList<any> = null;
  especialista:any;
  especialidades:any={}
  listaEspecialistas: Array<Especialista> = [];
  listaEspecialidades: Array<any> = [];
  listaEspEsp: Array<any> = [];
  constructor(private authSvc: AuthService, private storage: AngularFireStorage, private db: AngularFireDatabase) {
    this.esperef = db.list(this.dbPath);
    this.especialidadesref = db.list(this.dbPath2);
    this.getlistEspecialistas().then(datos => {
      this.listaEspecialistas = <Array<any>>datos;
    });
    this.getListEspecialidades().then(datos => {
      this.listaEspecialidades = <Array<any>>datos;
    });
    this.getListEspEsp().then(data=>{
      this.listaEspEsp=<Array<any>>data;
    })
  }

  createEspecialista(especialista: Especialista): boolean {
    let flag=false;
    try {
      this.authSvc.GetCurrentUser().then((response: any) => {
        var ref = firebase.default.database().ref(this.dbPath);
        var fotoName = especialista.imagen.name;
        let extencion = fotoName.split('.').pop()
        const filepath = `/especialistas/${response.uid}/perfil1.${extencion}`;
        const task = this.storage.upload(filepath, especialista.imagen).then(() => {
          let storages = firebase.default.storage();
          let storageRef = storages.ref();
          let spaceRef = storageRef.child(filepath);
          spaceRef.getDownloadURL().then(url => {
            especialista.imagen = url;
            ref.child(`${response.uid}`).set({
              nombre: especialista.nombre,
              apellido: especialista.apellido, edad: especialista.edad,
              dni: especialista.dni, especialidad: especialista.especialidad,
              email: especialista.email, password: especialista.password,
              imagen: `${especialista.imagen}`, alta: especialista.alta, dias: especialista.dias
            })
          });
        })

      });
      this.authSvc.LogOutCurrentUser();
      flag=true;
    } catch (error) {
      console.log("ERROR", error)
    }
    return flag
  }
  getEspecialistas() {
    return this.listaEspecialistas
  }

  getListEspEsp(){
    let espesp
    let aux
    return new Promise(resolve=>{
      this.esperef.snapshotChanges().subscribe(especialistas => {
        this.listaEspEsp.splice(0, this.listaEspEsp.length)
        especialistas.forEach((element1) => {
          espesp=element1.payload.val()
          espesp.especialidad.forEach(element2 => {
            aux=element1.payload.val()
            aux.especialidad=element2;
            if(aux.alta==true)
            this.listaEspEsp.push(aux)
          });
        })
        resolve(this.listaEspEsp)
      });
    })
  }
  returnEspEsp(){
    return this.listaEspEsp;
  }

  getlistEspecialistas() {
    return new Promise(resolve => {
      this.esperef.snapshotChanges().subscribe(admins => {
        this.listaEspecialistas.splice(0, this.listaEspecialistas.length)
        admins.forEach((element) => {
          this.especialista = element.payload.val();
          this.especialista.id = element.key;
          if(this.especialista.alta==true){
            this.especialista.classboton='btn btn-outline-success';
            this.especialista.classicono='fas fa-check';
          }
          if(this.especialista.alta==false){
            this.especialista.classboton='btn btn-outline-danger';
            this.especialista.classicono='fas fa-times';
          }
          this.listaEspecialistas.push(this.especialista)
        })
        resolve(this.listaEspecialistas)
      });
    })
  }
  getEspecialidades() {
    return this.listaEspecialidades
  }
  getListEspecialidades() {
    return new Promise(resolve => {
      this.especialidadesref.snapshotChanges().subscribe(admins => {
        this.listaEspecialidades.splice(0, this.listaEspecialidades.length)
        admins.forEach((element) => {
          this.especialidades=element.payload.val()
          this.listaEspecialidades.push(this.especialidades)
        })
        resolve(this.listaEspecialidades)
      });
    })
  }
  verificarEspecialidad(especialidad): boolean {
    
    let flag = false;
    this.listaEspecialidades.forEach((data) => {
      if (this.tolower.transform(especialidad) == this.tolower.transform(data.especialidad) ) {
        flag = true;
      }
    })
    return flag
  }
  getEspecialistaUID(espKey: string) {
    let elesp: Especialista = undefined;
    if (espKey != null)
      espKey = espKey.replace(/['"]+/g, '')
    this.listaEspecialistas.forEach((element) => {
      if (element.id == espKey) {
        elesp = element;
      }
    })
    return elesp;
  }

  updateEspecialista(especialista: Especialista) {
    return this.esperef.update(especialista.id, {alta:especialista.alta}).then(() => {
      var ref = firebase.default.database().ref('/Especialidades');
      especialista.imagen = 'https://firebasestorage.googleapis.com/v0/b/tp-clinica-516b7.appspot.com/o/Especialidades%2FdefaultEsp.jpg?alt=media&token=d105e45e-3bdd-4028-a460-1963efa69be9'
      especialista.especialidad.forEach((data) => {
        if (this.verificarEspecialidad(data) == false) {
          ref.push({
            especialidad: this.tolower.transform(data),
            imagen: especialista.imagen
          });
        }
      });

    });
  }

  subirHorarios(horariosEspecialista){
    var ref = firebase.default.database().ref("/Horarios");
    return ref.child(`${horariosEspecialista.especialista.id}`).set(
      horariosEspecialista
    )
  }
  getHorarios(especialista){
    var ref = firebase.default.database().ref("/Horarios");
    return new Promise(resolve=>{
      ref.child(`${especialista.id}`).once('value',dato=>{
        resolve(dato.val())
      })
    })
  }



}

