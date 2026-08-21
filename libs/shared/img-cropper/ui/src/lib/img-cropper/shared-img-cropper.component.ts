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
  ImageCroppedEvent,
  ImageCropperComponent,
  ImageTransform,
  LoadedImage,
} from 'ngx-image-cropper';

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
  protected readonly zoom = signal<number>(1);

  readonly #originalFileName = signal<string>('avatar.png');
  readonly #croppedBlob = signal<Blob | null>(null);
  readonly #croppedPreview = signal<SafeUrl | null>(null);

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

  protected readonly transform = computed<ImageTransform>(() => ({
    scale: this.zoom(),
    translateH: 0,
    translateV: 0,
  }));

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
    this.zoom.set(value);
  }

  onBackToUpload(): void {
    this.imageBase64.set(undefined);
    this.#croppedBlob.set(null);
    this.#croppedPreview.set(null);
    this.errorMessage.set(null);
    this.zoom.set(1);
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
    this.zoom.set(1);

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
    this.zoom.set(1);
  }
}
