import { Dia } from "../dia/dia";

export class Especialista{
    id:string="";
    nombre:string="";
    apellido:string="";
    edad:number=0;
    dni:number=0;
    especialidad:Array<string>=[];
    email:string="";
    password:string="";
    imagen:any;
    alta:boolean=false;
    dias:Dia[]=this.cargaHorarios()


    cargaHorarios(){
        let horarios=[];
        let Aux = new Dia(true,'LUNES','8:00','19:00');
        let Aux2 = new Dia(true,'MARTES','8:00','19:00');
        let Aux3= new Dia(true,'MIERCOLES','8:00','19:00');
        let Aux4 = new Dia(true,'JUEVES','8:00','19:00');
        let Aux5 = new Dia(true,'VIERNES','8:00','19:00');
        let Aux6 = new Dia(true,'SABADO','8:00','14:00');
        horarios.push(Aux);
        horarios.push(Aux2);
        horarios.push(Aux3);
        horarios.push(Aux4);
        horarios.push(Aux5);
        horarios.push(Aux6);
        
        return horarios;
    }
}