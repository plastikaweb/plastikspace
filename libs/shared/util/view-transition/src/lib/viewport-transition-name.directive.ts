import { Directive, ElementRef, inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[plastikViewportTransitionName]',
  standalone: true,
})
export class ViewportTransitionNameDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private observer!: IntersectionObserver;

  ngOnInit() {
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            // Forcefully disable the transition name if not visible to prevent broken animations
            this.renderer.setStyle(this.el.nativeElement, 'view-transition-name', 'none');
          } else {
            // Remove the override so the [style.view-transition-name] binding can work again
            this.renderer.removeStyle(this.el.nativeElement, 'view-transition-name');
          }
        });
      },
      { rootMargin: '0px' }
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
