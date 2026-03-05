import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
  untracked,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

export type ImageDimensions = { width: number; height: number } | undefined;

@Component({
  selector: 'plastik-img-container',
  imports: [NgOptimizedImage, MatIcon, TranslateModule, NgTemplateOutlet],
  templateUrl: './shared-img-container.component.html',
  styleUrl: './shared-img-container.component.scss',
  host: {
    class: 'relative block overflow-hidden',
    '[style.aspect-ratio]': 'aspectRatio()',
    '[style.width.px]': 'width()',
    '[style.height.px]': 'height()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedImgContainerComponent {
  src = input.required<string | null>();
  title = input.required<string>();
  dimensions = input<ImageDimensions>();
  quality = input<number>(80);
  lcpImage = input<boolean>(false);
  sizes = input<string>(
    '(max-width: 639px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, (max-width: 1279px) 25vw, 250px'
  );
  thumbSizes = input<number[]>([100, 300, 500, 750, 1600]);

  readonly aspectRatio = computed(() => {
    const dims = this.dimensions();
    if (dims?.width && dims?.height) {
      return `${dims.width} / ${dims.height}`;
    }
    return 'auto';
  });

  readonly width = computed(() => {
    // Only set explicit width if it's fixed (not fill)
    // In fill mode we usually want it to take container space,
    // but aspect-ratio will handle the height.
    return undefined;
  });

  readonly height = computed(() => {
    return undefined;
  });

  readonly computedSrcset = computed(() =>
    this.thumbSizes()
      .map(s => `${s}w`)
      .join(', ')
  );

  readonly #loaded = signal(false);
  readonly #error = signal(false);

  readonly isLoading = computed(() => !!this.src() && !this.#loaded() && !this.#error());
  readonly hasError = computed(() => this.#error() || !this.src());

  constructor() {
    effect(() => {
      this.src();
      untracked(() => {
        this.#loaded.set(false);
        this.#error.set(false);
      });
    });
  }

  onImageLoad(): void {
    this.#loaded.set(true);
  }

  onImageError(): void {
    this.#error.set(true);
    this.#loaded.set(false);
  }
}
