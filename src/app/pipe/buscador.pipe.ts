import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buscador'
})
export class BuscadorPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    if(arg==='' || arg.length<2) return value
    const resultPost=[];
    for (const especialista of value) {
        if(especialista.nombre.toLowerCase().indexOf(arg.toLowerCase())>-1 || especialista.apellido.toLowerCase().indexOf(arg.toLowerCase())>-1 || especialista.especialidad.toLowerCase().indexOf(arg.toLowerCase())>-1){
          resultPost.push(especialista)
        }
        /* if(){
          resultPost.push(especialista)
        }
        if(){
          resultPost.push(especialista)
        } */
    }
    return resultPost
  }

  
}
