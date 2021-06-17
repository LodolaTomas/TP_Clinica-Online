import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/service/auth.service';
import { AdminService } from 'src/app/services/admin.service';
import { EspecialistasService } from 'src/app/services/especialistas.service';
import { PacienteService } from 'src/app/services/paciente.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public flag = false;
  userForm: FormGroup;
  private isEmail = /\S+@\S+\.\S+/;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authSrv: AuthService,
    private adminLogin: AdminService,
    private pacienteLogin: PacienteService,
    private especialistaLogin: EspecialistasService
  ) {
    this.authSrv.LogOutCurrentUser();
  }

  ngOnInit(): void {
    this.initForm();
  }
  onLogin() {
    this.authSrv.Login(this.userForm.value.email, this.userForm.value.password).then((response: any) => {
      this.ValidarAdmin(response.user)
      localStorage.setItem('login','si');
      this.ValidarPaciente(response.user)
      this.ValidarEspecialista(response.user)
    }).catch(error => { console.log('error', error) });
  }

  ValidarAdmin(usuario) {
    localStorage.setItem('uid', JSON.stringify(usuario.uid));
    this.adminLogin.getAdminUID(usuario.uid) != undefined ? this.router.navigateByUrl('/seccionUsuarios') : '';
  }
  ValidarPaciente(usuario) {
    localStorage.setItem('uid', JSON.stringify(usuario.uid));
    this.pacienteLogin.getPacienteUID(usuario.uid)!=undefined ? this.router.navigateByUrl('/seccionPaciente'): '';
  }
  ValidarEspecialista(usuario) {
    localStorage.setItem('uid', JSON.stringify(usuario.uid));
    this.especialistaLogin.getEspecialistaUID(usuario.uid)!=undefined ? this.router.navigateByUrl('/seccionEspecialista'): '';
  }

  LoginAdmin() {
    this.userForm.setValue({email:'admin@admin.com',password:'12345678'});
    this.flag=false;
  }
  LoginPaciente(){
    this.userForm.setValue({email:'cuevanaxdd@gmail.com',password:'12345678'});
    this.flag=false;
  }
  LoginPaciente2(){
    this.userForm.setValue({email:'kokelal535@revutap.com',password:'12345678'});
    this.flag=false;
  }
  LoginEspecialista(){
    this.userForm.setValue({email:'tomaslodola1@gmail.com',password:'12345678'});
    this.flag=false;
  }
  LoginEspecialista2(){
    this.userForm.setValue({email:'lijaj38647@vvaa1.com',password:'12345678'});
    this.flag=false;
  }
  isValidField(field: string): string {
    const validateField = this.userForm.get(field);
    return !validateField.valid && validateField.touched
      ? 'is-invalid'
      : validateField.touched
        ? 'is-valid'
        : '';
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(this.isEmail)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

}
