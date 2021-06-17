import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    const resultPost=[];
    for (const especialista of value) {
      for (const especialidades of especialista.especialidad) {
        if(especialidades.toLowerCase().indexOf(arg.toLowerCase())>-1){
          resultPost.push(especialista)
        }
      }
    }
    return resultPost
  }

}
