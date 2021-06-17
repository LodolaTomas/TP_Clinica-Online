import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/service/auth.service';
import { Especialista } from 'src/app/class/especialista/especialista';
import { Paciente } from 'src/app/class/paciente/paciente';
import { AdminService } from 'src/app/services/admin.service';
import { EspecialistasService } from 'src/app/services/especialistas.service';
import { PacienteService } from 'src/app/services/paciente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  titulo;
  public flag = false;
  clase: string;
  inputfile: string;
  userForm: FormGroup;
  foto1: any;
  foto2: any;
  private isEmail = /\S+@\S+\.\S+/;
  especialidades = [];
  listaespecialidades = [];
  textoEspecialidades: string = "";
  constructor(private router: Router, private fb: FormBuilder, private authSvc: AuthService,
    private espSrv: EspecialistasService, private pacSrv: PacienteService, private admSrv: AdminService,
    ) {
      if (this.router.url === '/ingreso/registerPaciente') {
      this.titulo = 'Registro Paciente';
      this.flag = true;
      this.clase = "col-md-4";
      this.inputfile = "col-md-6";
      this.initFormPaciente();
    } else {
      this.titulo = 'Registro Especialista';
      this.clase = "col-md-6";
      this.inputfile = "col-md-12"
      this.initFormEspecialista();
      this.listaespecialidades=espSrv.getEspecialidades()
    }
    
  }
  

  AgregarEspecialidades() {
    this.especialidades.push(this.userForm.value.especialidades)
    this.textoEspecialidades = "";
  }
  AgregarEspecialidades1(item) {
    this.especialidades.push(item.especialidad)
  }

  BorrarEspecialidades(especialidad: string) {
    let index = this.especialidades.indexOf(especialidad)
    this.especialidades.splice(index, 1)
  }
  onUpload1($event) {
    console.log($event.target.files[0])
    this.foto1 = $event.target.files[0];

  }
  onUpload2($event) {
    console.log($event.target.files[0])
    this.foto2 = $event.target.files[0];
  }
  async onRegister() {
    if (this.flag == true) {
      this.authSvc.Register(this.userForm.value.email, this.userForm.value.password)
        .then(response => {
          let paciente = new Paciente();
          paciente.email = this.userForm.value.email;
          paciente.password = this.userForm.value.password;
          paciente.nombre = this.userForm.value.nombre;
          paciente.apellido = this.userForm.value.apellido;
          paciente.dni = this.userForm.value.dni;
          paciente.edad = this.userForm.value.edad;
          paciente.imagen1 = this.foto1;
          paciente.imagen2 = this.foto2;
          paciente.id = response.user.uid;
          if(this.pacSrv.createPaciente(paciente)){
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Has sido registrado Correctamente',
              showConfirmButton: false,
              timer: 1500
            })
            setTimeout(()=>{
              this.router.navigateByUrl("/login")
            },1500)
          }
        })
    } else {
      this.authSvc.Register(this.userForm.value.email, this.userForm.value.password)
        .then(response => {
          let especialista = new Especialista()
          especialista.email = this.userForm.value.email;
          especialista.password = this.userForm.value.password;
          especialista.nombre = this.userForm.value.nombre;
          especialista.apellido = this.userForm.value.apellido;
          especialista.dni = this.userForm.value.dni;
          especialista.edad = this.userForm.value.edad;
          especialista.especialidad = this.especialidades;
          especialista.imagen = this.foto1;
          especialista.id = response.user.uid;
          especialista.dias=especialista.cargaHorarios()
          if(this.espSrv.createEspecialista(especialista)){
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Has sido registrado Correctamente',
              showConfirmButton: false,
              timer: 1500
            })
            setTimeout(()=>{
              this.router.navigateByUrl("/login")
            },1500)
            
          }
        }).catch(e => { console.log(e) });
    }
  }

  public LoginRapido() {
    this.userForm.value.password = "";
    this.userForm.value.email = "";
    this.onRegister();
  }
  isValidField(field: string): string {
    const validateField = this.userForm.get(field);
    return !validateField.valid && validateField.touched
      ? 'is-invalid'
      : validateField.touched
        ? 'is-valid'
        : '';
  }
  estaVacio() {
    const validateField = this.userForm.get('especialidades')
    if ((this.especialidades.length < 1 || this.especialidades == undefined)) {
      return validateField.touched
        ? 'is-invalid'
        : validateField.touched
          ? 'is-valid'
          : '';
    } else {
      return 'is-valid'
    }
  }

  private initFormPaciente(): void {
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(15), Validators.max(120)]],
      dni: ['', [Validators.required, Validators.minLength(8)]],
      obraSocial: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(this.isEmail)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      foto1: ['', [Validators.required]],
      foto2: ['', [Validators.required]],
    });
  }

  private initFormEspecialista(): void {
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(15), Validators.max(120)]],
      dni: ['', [Validators.required, Validators.minLength(8)]],
      especialidades: ['', []],
      email: ['', [Validators.required, Validators.pattern(this.isEmail)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      foto1: ['', [Validators.required]],
    });
  }
  public textEmpty() {
    let flag = false;
    if (this.textoEspecialidades === "") {
      flag = true;
    }
    return flag;
  }

  botonRegistrar() {
    let flag;
    if ((this.especialidades.length < 1 || this.especialidades == undefined) ||
      this.userForm.invalid) {
      flag = true;
    } else {
      flag = false;
    }
    return flag
  }
  botonRegistrar2() {
    let flag=true;
    if (!this.userForm.invalid) {
      flag = false;
    } 
    return flag
  }

  

}
