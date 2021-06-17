import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'octavio'
})
export class OctavioPipe implements PipeTransform {

  transform(value: any): any {
    let resultPost=''
    if(value.length>11){
      resultPost=value.slice(0,value.length-9)+'...'
      return resultPost
    }
    return value
  }

}
