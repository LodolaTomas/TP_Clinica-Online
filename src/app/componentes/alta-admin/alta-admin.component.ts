import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReCaptchaV3Service } from 'ngx-captcha';
import { AuthService } from 'src/app/auth/service/auth.service';
import { Admin } from 'src/app/class/admin/admin';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alta-admin',
  templateUrl: './alta-admin.component.html',
  styleUrls: ['./alta-admin.component.scss']
})
export class AltaAdminComponent implements OnInit {

  titulo;
  public flag = false;
  clase: string;
  inputfile: string;
  userForm: FormGroup;
  foto1: any;
  private isEmail = /\S+@\S+\.\S+/;
  constructor(private fb: FormBuilder, private authSvc: AuthService, private admSrv: AdminService) {
    this.initFormEspecialista()
  }
  ngOnInit(): void {
    
  }

  onUpload1($event) {
    this.foto1 = $event.target.files[0];

  }
  
  async onRegister() {
    this.authSvc.Register(this.userForm.value.email, this.userForm.value.password)
        .then(response => {
          let especialista:Admin = new Admin();
          especialista.email = this.userForm.value.email;
          especialista.password = this.userForm.value.password;
          especialista.nombre = this.userForm.value.nombre;
          especialista.apellido = this.userForm.value.apellido;
          especialista.dni = this.userForm.value.dni;
          especialista.edad = this.userForm.value.edad;
          especialista.imagen = this.foto1;
          especialista.id = response.user.uid;
          if(this.admSrv.createAdmin(especialista)){
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Admin Creado',
              showConfirmButton: false,
              timer: 1500
            })
            this.userForm.reset
          }
        }).catch(e => { console.log(e) });
  }

  isValidField(field: string): string {
    const validateField = this.userForm.get(field);
    return !validateField.valid && validateField.touched
      ? 'is-invalid'
      : validateField.touched
        ? 'is-valid'
        : '';
  }
  
  private initFormEspecialista(): void {
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(15), Validators.max(120)]],
      dni: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.pattern(this.isEmail)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      foto1: ['', [Validators.required]],
    });
  }
  
  botonRegistrar2() {
    let flag = true;
    if (!this.userForm.invalid) {
      flag = false;
    }
    return flag
  }




}
