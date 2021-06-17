import { Component,OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/service/auth.service';
import { Dia } from 'src/app/class/dia/dia';
import { AdminService } from 'src/app/services/admin.service';
import { EspecialistasService } from 'src/app/services/especialistas.service';
import { PacienteService } from 'src/app/services/paciente.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  login = false;
  uid
  usuario;
  diasProfesional:Dia[];
  constructor(private authSrv: AuthService, public router: Router, private adminSrv: AdminService, private espSrv: EspecialistasService, private pacSrv: PacienteService) {
  if(localStorage.getItem('login')=='si'){
    this.login=true;
  }
  }
  ngOnInit(): void {

  }
  delogar() {
    this.authSrv.GetCurrentUser();
    this.login = true;
    localStorage.removeItem('login');
    localStorage.removeItem('uid')
    localStorage.removeItem('usuario')
    this.router.navigateByUrl('/bienvenido');
  }

}
