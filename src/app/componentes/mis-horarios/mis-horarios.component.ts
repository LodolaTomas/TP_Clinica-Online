import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Especialista } from 'src/app/class/especialista/especialista';
import { EspecialistasService } from 'src/app/services/especialistas.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-mis-horarios',
  templateUrl: './mis-horarios.component.html',
  styleUrls: ['./mis-horarios.component.scss']
})
export class MisHorariosComponent implements OnInit {
  @Input() especialista: Especialista;
  @Output() guardado: EventEmitter<any>= new EventEmitter<any>(); 
  especialidades
  flag=false;
  form: FormGroup;
  public checks= [
    {description: 'Lunes', value: false,numero:1},
    {description: "Martes", value: false,numero:2},
    {description: "Miercoles", value:false,numero:3},
    {description: "Jueves", value: false,numero:4},
    {description: "Viernes", value: false,numero:5},
    {description: "Sabado", value: false,numero:6},
  ];
  espSelec;
  get ordersFormArray() {
    return this.form.controls.orders as FormArray;
  }
  constructor(private formBuilder: FormBuilder,private espSrv:EspecialistasService) {
    this.form = this.formBuilder.group({
      orders: new FormArray([])
    });
    this.addCheckboxes();
  }
  private addCheckboxes() {
    this.checks.forEach(() => this.ordersFormArray.push(new FormControl(false)));
  }
  salir(){
    this.guardado.emit(false);
  }
  submit() {
    const selectedOrderIds = this.form.value.orders
      .map((checked, i) => checked ? this.checks[i].numero : null)
      .filter(v => v !== null);
      var horEspecialista={
        'especialista':this.especialista,
        'especialidad':this.espSelec,
        'horarios':selectedOrderIds
      }
    this.espSrv.subirHorarios(horEspecialista).then(()=>{
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Horarios Guardados',
        showConfirmButton: false,
        timer: 1500
      })
    });
  }
  espSeleccionada(esp){
    this.espSelec=esp;
    this.flag=true;
  }
  ngOnInit(): void {
    this.especialidades=this.especialista.especialidad;
  }
}
