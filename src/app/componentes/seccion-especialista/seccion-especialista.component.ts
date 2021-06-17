import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Especialista } from 'src/app/class/especialista/especialista';
import * as firebase from 'firebase';
import { TurnosService } from 'src/app/services/turnos.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Turnos } from 'src/app/class/turnos/turnos';

@Component({
  selector: 'app-seccion-especialista',
  templateUrl: './seccion-especialista.component.html',
  styleUrls: ['./seccion-especialista.component.scss']
})
export class SeccionEspecialistaComponent implements OnInit {
  uidEspecialista
  especialista:Especialista;
  habilitado=true;
  flag=false
  misTurnos:any[]=[];
  formularioComentario: FormGroup;
  formularioHistoriaClinica: FormGroup;
  formularioHistoriaClinicaDatos: FormGroup;
  respuestaTurno:any={};
  comentario;
  historiaPaciente;
  datosExtas:any= [];
  textodato: string = "";
  textovalor: string = "";
  @ViewChild('modalRechazar', { read: TemplateRef }) modalRechazar: TemplateRef<any>;

  @ViewChild('modalCancelar', { read: TemplateRef })
  modalCancelar: TemplateRef<any>;

  @ViewChild('modalFinalizar', { read: TemplateRef })
  modalFinalizar: TemplateRef<any>;

  @ViewChild('modalVerComentario', { read: TemplateRef })
  modalVerComentario: TemplateRef<any>;


  constructor(private turnSrv:TurnosService,private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private vref: ViewContainerRef) { 
    this.uidEspecialista=JSON.parse(localStorage.getItem('uid'));
    this.formularioComentario = formBuilder.group({
      comentario: new FormControl(''),
    });

    this.formularioHistoriaClinica = formBuilder.group({
      altura: new FormControl(''),
      peso: new FormControl(''),
      temperatura: new FormControl(''),
      presion: new FormControl(''),
      comentario: new FormControl(''),
      dato: new FormControl(''),
      valor: new FormControl(''),
    });

    this.formularioHistoriaClinicaDatos
      = formBuilder.group({
        dato: new FormControl(''),
        valor: new FormControl(''),
      });
  }

  ngOnInit(): void {
    firebase.default.database().ref("/Especialista/"+this.uidEspecialista).on("value",snapshot=>{
      this.especialista=snapshot.val()
    if(this.especialista.alta==false){
      this.habilitado=false
    }
    console.log(this.misTurnos)
    })  
    
    firebase.default.database().ref("/Turnos/").on("value",snapshot=>{
      var turno:any;
      this.misTurnos.splice(0,this.misTurnos.length)
      snapshot.forEach(element=>{
        if(element.val().especialista.id==this.especialista.id){
          turno=element.val()
          turno.id=element.key
          this.misTurnos.push(turno)
        }
      })
    })

  }
  guardado(respuesta){
    this.flag=respuesta
  }
  public textEmpty() {
    let flag = false;
    if (this.textodato === "" || this.textovalor==="") {
      flag = true;
    }
    return flag;
  }
  AgregarDatosExtas() {
    let dato=this.formularioHistoriaClinicaDatos.value.dato;
    let valor=this.formularioHistoriaClinicaDatos.value.valor;
    if (this.datosExtas.length < 3) {
      this.datosExtas[dato]=valor;
      console.log(this.datosExtas)
    }
  }
  BorrarDatosExtas(especialidad: string) {
    let index = this.datosExtas.indexOf(especialidad)
    this.datosExtas.splice(index, 1)
  }
  guardarTurno(respuesta:string,id:string){
    
     this.respuestaTurno.id=id;
     this.respuestaTurno.respuesta=respuesta;
    if(respuesta=='aceptado'){
      this.turnSrv.aceptarTurno(this.respuestaTurno)
    }
    if(respuesta=='rechazado' || respuesta=='cancelado'){
      this.modalService.open(this.modalRechazar);
    }
    if(respuesta=="finalizado"){
      this.modalService.open(this.modalFinalizar);
    }
    if(respuesta=='resenia'){
      this.comentario=undefined;
      this.historiaPaciente=this.turnSrv.verHistorialClinico(this.respuestaTurno)
      console.log(this.historiaPaciente)
      this.modalService.open(this.modalVerComentario)

    }
  }
  verMotivo(comentario){
    this.comentario=comentario;
    this.modalService.open(this.modalVerComentario)
  }
  rechazarTurnoModal() {
    this.respuestaTurno.comentarios= this.formularioComentario.value.comentario;
    this.turnSrv.rechazarTurno(this.respuestaTurno)
    this.modalService.dismissAll();
  }  
  finalizarTurnoModal() {
    var historiaClinica:any={};
    historiaClinica.altura=this.formularioHistoriaClinica.value.altura;
    historiaClinica.peso = this.formularioHistoriaClinica.value.peso;
    historiaClinica.temperatura =  this.formularioHistoriaClinica.value.temperatura;
    historiaClinica.presion = this.formularioHistoriaClinica.value.presion;
    historiaClinica.datos=Object.assign({}, this.datosExtas);
    this.respuestaTurno.historialClinica=historiaClinica;
    this.turnSrv.finalizar(this.respuestaTurno)
    this.modalService.dismissAll();
  }


}
