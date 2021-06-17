import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from '../auth/service/auth.service';
import * as firebase from 'firebase';
import { Admin } from '../class/admin/admin';
import {AngularFireList,AngularFireDatabase} from '@angular/fire/database';
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private dbPath = '/Admins';
  admin:Admin;
  listAdmins:Admin[]=[];
  adminiref:AngularFireList<Admin>=null;
  constructor(private authSvc: AuthService, private storage: AngularFireStorage, private db:AngularFireDatabase) {
    this.adminiref=db.list(this.dbPath);
    this.getlistAdmins().then(datos=>{this.listAdmins=<Array<any>>datos})
  }
  
  
  createAdmin(admin: Admin): boolean {
    let flag=false;
    try {
      this.authSvc.GetCurrentUser().then((response: any) => {
        var ref = firebase.default.database().ref(this.dbPath);
        var fotoName = admin.imagen.name;
        let extencion = fotoName.split('.').pop()
        const filepath = `/admins/${response.uid}/perfil1.${extencion}`;
        const task = this.storage.upload(filepath, admin.imagen).then(() => {
          let storages = firebase.default.storage();
          let storageRef = storages.ref();
          let spaceRef = storageRef.child(filepath);
          spaceRef.getDownloadURL().then(url => {
            admin.imagen = url;
            ref.child(`${response.uid}`).set({
              nombre: admin.nombre,
              apellido: admin.apellido,
              edad: admin.edad,
              dni: admin.dni,
              email: admin.email,
              password: admin.password,
              imagen: `${admin.imagen}`
            })
          });
        })
      })
      this.authSvc.LogOutCurrentUser();
      flag=true;
    } catch (error) {
      console.log(error)
    }
    return flag
  }

  getlistAdmins(){
    return new Promise(resolve=>{
      this.adminiref.snapshotChanges().subscribe(admins=>{
        this.listAdmins.splice(0, this.listAdmins.length)
        admins.forEach((element)=>{
          this.admin=element.payload.val();
          this.admin.id=element.key
          this.listAdmins.push(this.admin)
        })
        resolve(this.listAdmins)
      });
    })
  }

  getAdmins(){
    return this.listAdmins
  }

  getAdminUID(adminkey: string) {
    let eladmin;
    if(adminkey!=null)
    adminkey=adminkey.replace(/['"]+/g,'')
    this.listAdmins.forEach(element=>{
      if(element.id== adminkey){
        eladmin=element;
      }
    });
    return eladmin;
  }
  

}
