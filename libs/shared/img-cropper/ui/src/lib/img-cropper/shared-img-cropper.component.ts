import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { BytesToSizePipe } from '@plastik/shared/bytes-to-size';
import {
  CropperPosition,
  Dimensions,
  ImageCroppedEvent,
  ImageCropperComponent,
  ImageTransform,
  LoadedImage,
} from 'ngx-image-cropper';

/** Way the image moves under the crop area when a pan button is pressed. */
export type ImgCropperPanDirection = 'up' | 'down' | 'left' | 'right';

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_STEP = 0.1;
/** Share of the image, at its current zoom, that one press of a pan button moves it. */
const PAN_STEP_RATIO = 0.05;

export interface ImgCropperConfig {
  /** Minimum width in pixels. Default: 200. */
  minWidth?: number;
  /** Minimum height in pixels. Default: 200. */
  minHeight?: number;
  /** Maximum file size in bytes. Default: 2621440 (2.5 MB). */
  maxSizeBytes?: number;
  /** Output image quality 0–1. Default: 0.92. */
  quality?: number;
  /** Upload step title. */
  uploadTitle?: string;
  /** Crop step title. */
  cropTitle?: string;
  /** Round cropper overlay. Default: true. */
  roundCropper?: boolean;
}

@Component({
  selector: 'plastik-img-cropper',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    MatTooltipModule,
    ImageCropperComponent,
    TranslateModule,
    NgTemplateOutlet,
  ],
  providers: [BytesToSizePipe],
  templateUrl: './shared-img-cropper.component.html',
  styleUrl: './shared-img-cropper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedImgCropperComponent {
  readonly #sanitizer = inject(DomSanitizer);

  /** Configuration for validation and output quality. */
  readonly config = input<ImgCropperConfig>({});

  /** Emits the cropped square File ready for upload. */
  readonly cropConfirmed = output<File>();

  /** Emits when the user cancels the cropping. */
  readonly cropCancelled = output<void>();

  protected readonly imageBase64 = signal<string | undefined>(undefined);
  protected readonly errorMessage = signal<{
    key: string;
    params?: Record<string, unknown>;
  } | null>(null);
  protected readonly isDragging = signal<boolean>(false);
  protected readonly zoom = signal<number>(ZOOM_MIN);
  protected readonly zoomMin = ZOOM_MIN;
  protected readonly zoomMax = ZOOM_MAX;
  protected readonly zoomStep = ZOOM_STEP;
  protected readonly panButtons: readonly {
    direction: ImgCropperPanDirection;
    icon: string;
    label: string;
  }[] = [
    { direction: 'left', icon: 'arrow_back', label: 'common.image.crop.moveLeft' },
    { direction: 'up', icon: 'arrow_upward', label: 'common.image.crop.moveUp' },
    { direction: 'down', icon: 'arrow_downward', label: 'common.image.crop.moveDown' },
    { direction: 'right', icon: 'arrow_forward', label: 'common.image.crop.moveRight' },
  ];
  /** Image offset in displayed pixels, set by the pan buttons or by dragging the image. */
  protected readonly translateH = signal<number>(0);
  protected readonly translateV = signal<number>(0);

  readonly #originalFileName = signal<string>('avatar.png');
  readonly #croppedBlob = signal<Blob | null>(null);
  readonly #croppedPreview = signal<SafeUrl | null>(null);
  /** Size of the image as displayed, from `cropperReady`. */
  readonly #displayedSize = signal<Dimensions | null>(null);
  /** Crop area in displayed pixels, from `cropperChange`. */
  readonly #cropArea = signal<CropperPosition | null>(null);

  readonly minWidth = computed(() => this.config().minWidth ?? 200);
  readonly minHeight = computed(() => this.config().minHeight ?? 200);
  readonly maxSizeBytes = computed(() => this.config().maxSizeBytes ?? 2621440);
  readonly maxSizeMb = computed(() => this.#bytesToSize.transform(this.maxSizeBytes(), 1));
  readonly outputQuality = computed(() => (this.config().quality ?? 0.92) * 100);
  readonly roundCropper = computed(() => this.config().roundCropper ?? true);
  protected readonly uploadTitle = computed(
    () => this.config().uploadTitle ?? 'common.image.upload.title'
  );
  protected readonly cropTitle = computed(
    () => this.config().cropTitle ?? 'common.image.crop.title'
  );

  protected readonly hasImage = computed(() => this.imageBase64() !== undefined);
  protected readonly hasCrop = computed(() => this.#croppedBlob() !== null);

  // Pixels, not the default `%`: the library adds a drag's pixel distance to `translateH` and
  // `translateV`, so with `%` a 30 px drag moved a 320 px wide image 96 px.
  protected readonly transform = computed<ImageTransform>(() => ({
    scale: this.zoom(),
    translateH: this.translateH(),
    translateV: this.translateV(),
    translateUnit: 'px',
  }));

  // How far the image can move each way and still cover the whole crop area. The image is scaled
  // around its centre, so its left edge sits at `width * (1 - zoom) / 2 + translateH`, which must
  // stay at or left of the crop area's `x1`; the same holds for each edge.
  readonly #panLimits = computed(() => {
    const size = this.#displayedSize();
    const area = this.#cropArea();

    if (!size || !area) return null;

    const zoom = this.zoom();

    return {
      minH: area.x2 - (size.width * (1 + zoom)) / 2,
      maxH: area.x1 + (size.width * (zoom - 1)) / 2,
      minV: area.y2 - (size.height * (1 + zoom)) / 2,
      maxV: area.y1 + (size.height * (zoom - 1)) / 2,
      step: Math.min(size.width, size.height) * zoom * PAN_STEP_RATIO,
    };
  });

  /** Whether the image can still move each way without uncovering the crop area. */
  protected readonly canPan = computed<Record<ImgCropperPanDirection, boolean>>(() => {
    const limits = this.#panLimits();

    return {
      up: !!limits && this.translateV() > limits.minV,
      down: !!limits && this.translateV() < limits.maxV,
      left: !!limits && this.translateH() > limits.minH,
      right: !!limits && this.translateH() < limits.maxH,
    };
  });

  readonly #bytesToSize = inject(BytesToSizePipe);

  onFileSelected(event: Event): void {
    this.errorMessage.set(null);
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.#handleFile(file);
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.errorMessage.set(null);
    this.isDragging.set(false);
    const file = event.dataTransfer?.files?.[0];

    this.#handleFile(file);
  }

  onImageLoaded(image: LoadedImage): void {
    const { original } = image;

    this.errorMessage.set(null);

    if (original.size.width < this.minWidth() || original.size.height < this.minHeight()) {
      this.errorMessage.set({
        key: 'common.image.error.minSize',
        params: { minWidth: this.minWidth(), minHeight: this.minHeight() },
      });
      this.imageBase64.set(undefined);
    }
  }

  onImageCropped({ blob, objectUrl }: ImageCroppedEvent): void {
    if (blob && objectUrl) {
      this.#croppedBlob.set(blob);
      this.#croppedPreview.set(this.#sanitizer.bypassSecurityTrustUrl(objectUrl));
    }
  }

  onLoadImageError(): void {
    this.errorMessage.set({ key: 'common.image.error.loaded' });
    this.imageBase64.set(undefined);
  }

  onZoomChange(value: number): void {
    const clamped = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, value));

    // One decimal, as the slider's step: repeated `+ 0.1` would drift (1.2000000000000002).
    this.zoom.set(Math.round(clamped * 10) / 10);
  }

  /**
   * Moves the image one step under the crop area, without dragging (WCAG 2.5.7).
   * It stops where the image would stop covering the crop area.
   * @param {ImgCropperPanDirection} direction Way the image moves.
   */
  onPan(direction: ImgCropperPanDirection): void {
    const limits = this.#panLimits();

    if (!limits || !this.canPan()[direction]) return;

    const { step } = limits;

    switch (direction) {
      case 'up':
        this.translateV.update(offset => Math.max(limits.minV, offset - step));
        break;
      case 'down':
        this.translateV.update(offset => Math.min(limits.maxV, offset + step));
        break;
      case 'left':
        this.translateH.update(offset => Math.max(limits.minH, offset - step));
        break;
      case 'right':
        this.translateH.update(offset => Math.min(limits.maxH, offset + step));
        break;
    }
  }

  /**
   * Keeps the offset of a drag, so the next zoom or pan starts from where the image was left.
   * @param {ImageTransform} transform Transform the cropper emits after a drag.
   */
  onTransformChange({ translateH, translateV }: ImageTransform): void {
    this.translateH.set(translateH ?? 0);
    this.translateV.set(translateV ?? 0);
  }

  /**
   * Stores the displayed image size once the cropper has laid it out.
   * @param {Dimensions} size Displayed size of the image.
   */
  onCropperReady(size: Dimensions): void {
    this.#displayedSize.set(size);
  }

  /**
   * Stores where the crop area is, which bounds the pan buttons.
   * @param {CropperPosition} area Crop area in displayed pixels.
   */
  onCropperChange(area: CropperPosition): void {
    this.#cropArea.set(area);
  }

  onBackToUpload(): void {
    this.imageBase64.set(undefined);
    this.#croppedBlob.set(null);
    this.#croppedPreview.set(null);
    this.errorMessage.set(null);
    this.#resetTransform();
  }

  onConfirm(): void {
    const blob = this.#croppedBlob();

    if (!blob) return;

    const baseName = this.#originalFileName().replace(/\.[^.]+$/, '');
    const file = new File([blob], `${baseName}.webp`, { type: 'image/webp' });

    this.cropConfirmed.emit(file);
    this.#reset();
  }

  onCancel(): void {
    this.#reset();
    this.cropCancelled.emit();
  }

  #handleFile(file: File | undefined): void {
    this.errorMessage.set(null);
    this.#croppedBlob.set(null);
    this.#croppedPreview.set(null);
    this.#resetTransform();

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.errorMessage.set({ key: 'common.image.error.notImage' });

      return;
    }

    if (file.size > this.maxSizeBytes()) {
      this.errorMessage.set({
        key: 'common.image.error.maxSize',
        params: { maxSize: this.maxSizeMb() },
      });

      return;
    }

    this.#originalFileName.set(file.name);

    const reader = new FileReader();

    reader.onload = () => {
      this.imageBase64.set(reader.result as string);
    };
    reader.onerror = () => {
      this.errorMessage.set({ key: 'common.image.error.read' });
    };
    reader.readAsDataURL(file);
  }

  onClearError() {
    this.errorMessage.set(null);
  }

  #reset(): void {
    this.imageBase64.set(undefined);
    this.#croppedBlob.set(null);
    this.#croppedPreview.set(null);
    this.errorMessage.set(null);
    this.#resetTransform();
  }

  #resetTransform(): void {
    this.zoom.set(ZOOM_MIN);
    this.translateH.set(0);
    this.translateV.set(0);
    this.#displayedSize.set(null);
    this.#cropArea.set(null);
  }
}
