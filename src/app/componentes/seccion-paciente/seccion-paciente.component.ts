import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/auth/service/auth.service';
import { EspecialistasService } from 'src/app/services/especialistas.service';
import { PacienteService } from 'src/app/services/paciente.service';
import Swal from 'sweetalert2';
import * as firebase from 'firebase';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { Img, PdfMakeWrapper } from 'pdfmake-wrapper';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TurnosService } from 'src/app/services/turnos.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Paciente } from 'src/app/class/paciente/paciente';

@Component({
  selector: 'app-seccion-paciente',
  templateUrl: './seccion-paciente.component.html',
  styleUrls: ['./seccion-paciente.component.scss']
})
export class SeccionPacienteComponent implements OnInit {
  paciente: Paciente = new Paciente();
  uid: any;
  listaespecialista: Array<any>;
  listaespecialidades: Array<any>;
  espSeleccionado;
  listaFiltrada: Array<any> = [];
  filterPost = [];
  horariosEsp: any = '';
  flagturno = false;
  listaTurno: any[] = [];
  selecEspecialidad;
  modal1 = false;
  comentario: any;
  formularioComentario: FormGroup;
  modal2 = false;
  misTurnos: any[] = [];
  respuestaTurno: any = {};
  vermisTurnos = false
  calificar: any = {};
  historiaPaciente;
  starRating = 0;
  unoconhistorias = false
  @ViewChild('modalRechazar', { read: TemplateRef }) modalRechazar: TemplateRef<any>;

  @ViewChild('modalCancelar', { read: TemplateRef })
  modalCancelar: TemplateRef<any>;

  @ViewChild('modalFinalizar', { read: TemplateRef })
  modalFinalizar: TemplateRef<any>;

  @ViewChild('modalVerComentario', { read: TemplateRef })
  modalVerComentario: TemplateRef<any>;


  @ViewChild('container', { static: false }) el!: ElementRef;

  calificacion: boolean;
  range = 0
  emojis = ['😠', '😦', '😑', '😀', '😍'];


  constructor(private pacSrv: PacienteService, private auth: AuthService, private espSrv: EspecialistasService,
    private formBuilder: FormBuilder, private turnSrv: TurnosService, private modalService: NgbModal) {
    this.listaespecialista = espSrv.getEspecialistas();
    this.listaespecialidades = espSrv.getEspecialidades();
    this.formularioComentario = formBuilder.group({
      comentario: new FormControl(''),
    });
  }

  async makePdf(item) {
    /* var DATA:any= document.getElementById("cardpdf"+i)
    const doc = new jsPDF('p','pt','a4');
    var imgWidth=309;
    var pageHeight=300;
    html2canvas(DATA,{allowTaint:false,useCORS:true}).then((canvas)=>{
      var imgHeight=canvas.height*imgWidth/canvas.width;

      const img = canvas.toDataURL('image/PNG',1);
      doc.addImage(img,"PNG",0,0,imgWidth,imgHeight)
      doc.save('test.pdf')
    }) */
  }
  ngOnInit(): void {
    this.uid = JSON.parse(localStorage.getItem('uid'));
    firebase.default.database().ref(`/Pacientes/${this.uid}`).on("value", snapshot => {
      this.paciente = <Paciente>snapshot.val();
      this.paciente.id = snapshot.key
    })
    console.log(this.range)
    firebase.default.database().ref("/Turnos/").on("value", snapshot => {
      this.misTurnos.splice(0, this.misTurnos.length)
      var turncompleto;
      snapshot.forEach(element => {
        if (element.val().paciente.id == this.paciente.id) {
          turncompleto = element.val()
          turncompleto.id = element.key
          turncompleto.estado == 'finalizado' ? this.unoconhistorias = true : ''
          this.misTurnos.push(turncompleto)
        }
      })
    })
  }
  turnosEspecialista(item, item2) {
    this.selecEspecialidad = item2
    this.espSeleccionado = item;
    this.espSrv.getHorarios(item).then((dato) => {
      this.horariosEsp = dato;
      this.listarTurnos()
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
  mostrarEspecialistas(especialidades) {
    this.listaespecialista.forEach(data => {
      data.especialidad.forEach(element => {
        if (element == especialidades) {
          this.listaFiltrada.push(data);
        }
      });
    });
  }

  sacarTurno(diaSeleccionado) {
    var turnoSeleccionado = { 'paciente': this.paciente, 'especialista': this.espSeleccionado, 'horario': diaSeleccionado, 'especialidad': this.selecEspecialidad, 'estado': 'pendiente' };
    console.log(turnoSeleccionado);
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

  onClickM1() {
    this.modal1 = true;
    this.modal2 = false;
  }
  onClickM2() {
    this.modal1 = false;
    this.modal2 = true;
    this.vermisTurnos = true
  }

  guardarTurno(respuesta: string, id: string) {

    this.respuestaTurno.id = id;
    this.respuestaTurno.respuesta = respuesta;
    if (respuesta == 'aceptado') {
      this.turnSrv.aceptarTurno(this.respuestaTurno)
    }
    if (respuesta == 'rechazado' || respuesta == 'cancelado') {
      this.modalService.open(this.modalRechazar);
    }
    if (respuesta == "finalizado") {
      this.calificacion = true;
      this.modalService.open(this.modalFinalizar);
    }
    if (respuesta == 'resenia') {
      this.comentario = undefined;
      this.historiaPaciente = id;
      console.log(this.historiaPaciente)
      this.modalService.open(this.modalVerComentario)
    }

  }

  encuestaPaciente(todo) {
    this.calificacion = false;
    this.modalService.open(this.modalFinalizar)
  }

  calificacionPaciente(turno) {
    this.calificacion = true
    this.calificar.especialidad = turno.especialidad;
    this.calificar.especialista = turno.especialista;
    this.calificar.paciente = turno.paciente;
    this.modalService.open(this.modalFinalizar);
  }
  guardarCalificion() {
    this.calificar.estrellas = this.starRating;
    var ref = firebase.default.database().ref().child("/Calificaciones").push(this.calificar)
    this.modalService.dismissAll();
  }
  verMotivo(comentario) {
    this.comentario = comentario;
    this.modalService.open(this.modalVerComentario)
  }
  rechazarTurnoModal() {
    this.respuestaTurno.comentarios = this.formularioComentario.value.comentario;
    this.turnSrv.rechazarTurno(this.respuestaTurno)
    this.modalService.dismissAll();
  }
  setRam(value) {
    this.range = value;
  }


}

