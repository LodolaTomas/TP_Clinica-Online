import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appSizer]'
})
export class SizerDirective {

  constructor(private element: ElementRef) {
  }
  @HostListener('mouseleave') onMouseExit() {

    this.marcar('')
    console.log('salii')
  }
  @HostListener('mouseenter') onMouseEnter() {
    console.log('entree')
    this.marcar('25px')
  }
  private marcar(size: string) {
    this.element.nativeElement.style.fontSize  = size;
  }


}
