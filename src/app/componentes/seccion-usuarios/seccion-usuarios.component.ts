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

import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import * as firebase from 'firebase';
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
  listaTurnos: any = [];
  espSeleccionado: any = undefined;
  panelOpenState = false;
  respuestaTurno: any = {};
  formularioComentario: FormGroup;
  comentario
  diasChart: Array<any> = [];
  @ViewChild('modalRechazar', { read: TemplateRef }) modalRechazar: TemplateRef<any>;
  @ViewChild('modalVerComentario', { read: TemplateRef }) modalVerComentario: TemplateRef<any>;
  lunes=0
  martes=0
  miercoles=0
  jueves=0
  viernes=0
  sabado=0
  listadoTurnos: any[] = [];

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [this.lunes,this.martes,this.miercoles,this.jueves,this.viernes,this.sabado], label: 'Turnos' }
  ];




  constructor(private admSrv: AdminService, private pacSrv: PacienteService, private espSrv: EspecialistasService,
    private turnSrv: TurnosService, private modalService: NgbModal, private formBuilder: FormBuilder) {
    this.formularioComentario = formBuilder.group({
      comentario: new FormControl(''),
    });
  }

   ngOnInit() {
    this.listaAdmins = this.admSrv.getAdmins();
    this.listaEspecialista = this.espSrv.getEspecialistas();
    this.listaPacientes = this.pacSrv.getPacientes();
     this.turnSrv.getAllTurns().then(e=>this.listaTurnos=e);
    this.turnSrv.algo().valueChanges().subscribe((data) => {
      data.forEach(element => {
          this.listadoTurnos.push(element);
          this.SumarCantidadTurnosPorDia(element);
      });
    });
  }

  SumarCantidadTurnosPorDia(element){
    var turno = element.horario.slice(0, 10);
        const [dd, mm, yyyy] = turno.split('/');
        let dia = new Date(dd, mm - 1, yyyy)
        if (dia.toLocaleDateString('en-Us', { weekday: 'long' }) === 'Monday') {
          this.lunes++
          this.barChartData[0].data[0]=this.lunes
        }
        if (dia.toLocaleDateString('en-Us', { weekday: 'long' }) === 'Tuesday') {
          this.martes++
          this.barChartData[0].data[1] =this.martes
        }
        if (dia.toLocaleDateString('en-Us', { weekday: 'long' }) === 'Wednesday') {
          this.miercoles++
          this.barChartData[0].data[2] =this.miercoles
        }
        if (dia.toLocaleDateString('en-Us', { weekday: 'long' }) === 'Thursday') {
          this.jueves++
          this.barChartData[0].data[3] =this.jueves
        }
        if (dia.toLocaleDateString('en-Us', { weekday: 'long' }) === 'Friday') {
          this.viernes++;
          this.barChartData[0].data[4] =this.viernes
        }
        if (dia.toLocaleDateString('en-Us', { weekday: 'long' }) === 'Saturday') {
          this.sabado++;
          this.barChartData[0].data[5]=this.sabado
        }
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
  generarExcel2() {
    //Creo el libro de excel
    let workbook = new Workbook();

    //Creo la hoja de excel
    let worksheet = workbook.addWorksheet("Listado de Turnos");

    //Agrego los titulos de la hoja
    let header = ["Paciente", "Hora", "Especialidad", "Especialista", "Estado"];
    let headerRow = worksheet.addRow(header);

    for (let item of this.listaTurnos) {
      let aux = [`${item.paciente.apellido}-${item.paciente.nombre}`, item.horario, item.especialidad, `${item.especialista.apellido}-${item.especialista.nombre}`, item.estado];
      worksheet.addRow(aux);
    }

    let fname = "Listado de Turnos";

    //add data and file name and download
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fname + '.xlsx');
    });
  }

}
