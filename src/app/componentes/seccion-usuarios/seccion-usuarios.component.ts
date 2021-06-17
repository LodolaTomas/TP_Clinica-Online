import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { Admin } from 'src/app/class/admin/admin';
import { Especialista } from 'src/app/class/especialista/especialista';
import { Paciente } from 'src/app/class/paciente/paciente';
import { AdminService } from 'src/app/services/admin.service';
import { EspecialistasService } from 'src/app/services/especialistas.service';
import { PacienteService } from 'src/app/services/paciente.service';
import { TurnosService } from 'src/app/services/turnos.service';
@Component({
  selector: 'app-seccion-usuarios',
  templateUrl: './seccion-usuarios.component.html',
  styleUrls: ['./seccion-usuarios.component.scss']
})
export class SeccionUsuariosComponent implements OnInit {
  styles = [];
  listaPacientes: Array<Paciente> = [];
  listaAdmins: Array<Admin> = [];
  listaEspecialista: Array<any> = [];
  listaTurnos: Array<any> = []
  espSeleccionado: any = undefined;
  panelOpenState = false;
  respuestaTurno: any = {};
  formularioComentario: FormGroup;
  comentario
  @ViewChild('modalRechazar', { read: TemplateRef }) modalRechazar: TemplateRef<any>;
  @ViewChild('modalVerComentario', { read: TemplateRef }) modalVerComentario: TemplateRef<any>;

  constructor(private admSrv: AdminService, private pacSrv: PacienteService, private espSrv: EspecialistasService,
    private turnSrv: TurnosService, private modalService: NgbModal, private formBuilder: FormBuilder) {
    this.formularioComentario = formBuilder.group({
      comentario: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.listaAdmins = this.admSrv.getAdmins();
    this.listaEspecialista = this.espSrv.getEspecialistas();
    this.listaPacientes = this.pacSrv.getPacientes();
    this.listaTurnos = this.turnSrv.getAllTurns();
    console.log(this.listaTurnos)
  }
  verUsuario(item) {
    this.espSeleccionado = item;
  }
  async darAlta(item: Especialista) {
    item.alta == true ? item.alta = false : item.alta = true;
    await this.espSrv.updateEspecialista(item);
  }

  guardarTurno(respuesta: string, id: string) {

    this.respuestaTurno.id = id;
    this.respuestaTurno.respuesta = respuesta;
    if (respuesta == 'rechazado' || respuesta == 'cancelado') {
      this.modalService.open(this.modalRechazar);
    }
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

  generarExcel() {
    //Creo el libro de excel
    let workbook = new Workbook();

    //Creo la hoja de excel
    let worksheet = workbook.addWorksheet("Listado de Usuarios");

    //Agrego los titulos de la hoja
    let header = ["Nombre", "Apellido", "Edad", "DNI", "Correo"];
    let headerRow = worksheet.addRow(header);

    for (let item of this.listaAdmins) {
      let aux = [item.nombre, item.apellido, item.edad, item.dni, item.email];
      worksheet.addRow(aux);
    }
    for (let item of this.listaEspecialista) {
      let aux = [item.nombre, item.apellido, item.edad, item.dni, item.email];
      worksheet.addRow(aux);
    }
    for (let item of this.listaPacientes) {
      let aux = [item.nombre, item.apellido, item.edad, item.dni, item.email];
      worksheet.addRow(aux);
    }

    let fname = "Listado de Usuarios";

    //add data and file name and download
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fname + '.xlsx');
    });
  }

}
