import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uppercase'
})
export class UppercasePipe implements PipeTransform {

  transform(value: string): string {
    let fist = value.substr(0,1).toUpperCase();
    return fist + value.substr(1);
  }

}
