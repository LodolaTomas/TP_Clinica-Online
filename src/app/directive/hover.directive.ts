import { Directive, ElementRef, HostListener } from '@angular/core';
@Directive({
  selector: '[appHover]'
})

export class HoverDirective {

  constructor(private element: ElementRef) {
  }
  @HostListener('mouseleave') onMouseExit() {

    this.marcar('')
  }
  @HostListener('mouseenter') onMouseEnter() {

    this.marcar('#007BFE')
  }
  private marcar(color: string) {
    this.element.nativeElement.style.color = color;
  }



}