import { Directive, ElementRef, inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[plastikViewportTransitionName]',
})
export class ViewportTransitionNameDirective implements OnInit, OnDestroy {
  readonly #el = inject(ElementRef);
  readonly #renderer = inject(Renderer2);
  #observer!: IntersectionObserver;

  ngOnInit() {
    this.#observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            // Forcefully disable the transition name if not visible to prevent broken animations
            this.#renderer.setStyle(this.#el.nativeElement, 'view-transition-name', 'none');
          } else {
            // Remove the override so the [style.view-transition-name] binding can work again
            this.#renderer.removeStyle(this.#el.nativeElement, 'view-transition-name');
          }
        });
      },
      { rootMargin: '0px' }
    );

    this.#observer.observe(this.#el.nativeElement);
  }

  ngOnDestroy() {
    this.#observer?.disconnect();
  }
}
