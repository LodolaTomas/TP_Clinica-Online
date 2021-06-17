import { Directive, ElementRef,Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appAgrandar]'
})
export class AgrandarDirective {

  constructor(private element: ElementRef,private renderer: Renderer2) {
  }
  @HostListener('mouseenter') onMouseEnter() {
    this.renderer.addClass(this.element.nativeElement,'grow')
  }

}
