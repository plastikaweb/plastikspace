import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SharedImgCropperComponent } from './shared-img-cropper.component';
import { axe } from 'vitest-axe';
import { MockComponent } from 'ng-mocks';
import { ImageCropperComponent } from 'ngx-image-cropper';

describe('SharedImgCropperComponent', () => {
  let component: SharedImgCropperComponent;
  let fixture: ComponentFixture<SharedImgCropperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedImgCropperComponent],
      providers: [provideTranslateService()],
    })
      .overrideComponent(SharedImgCropperComponent, {
        remove: { imports: [ImageCropperComponent] },
        add: { imports: [MockComponent(ImageCropperComponent)] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SharedImgCropperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset state on cancel', () => {
    const cancelSpy = vi.spyOn(component.cropCancelled, 'emit');
    component.onCancel();
    expect(cancelSpy).toHaveBeenCalled();
    expect(component['imageBase64']()).toBeUndefined();
  });

  it('should handle file selection', () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    const event = { target: { files: [file] } } as unknown as Event;

    const mockReader = {
      readAsDataURL: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      result: 'data:image/png;base64,123',
    };

    // @ts-ignore
    vi.stubGlobal(
      'FileReader',
      class {
        readAsDataURL = mockReader.readAsDataURL;
        addEventListener = mockReader.addEventListener;
        removeEventListener = mockReader.removeEventListener;
        onload: (() => void) | null = null;
      }
    );

    component.onFileSelected(event);
    expect(mockReader.readAsDataURL).toHaveBeenCalledWith(file);
  });

  it('should handle drag events', () => {
    const event = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as DragEvent;

    component.onDragOver(event);
    expect(component['isDragging']()).toBe(true);

    component.onDragLeave(event);
    expect(component['isDragging']()).toBe(false);
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });

  it('should have accessibility labels and tooltips on crop zoom and clear error buttons', () => {
    component['imageBase64'].set('data:image/png;base64,123');
    component['errorMessage'].set({ key: 'common.image.error.loaded' });
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button[matIconButton]');
    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach((btn: HTMLButtonElement) => {
      expect(btn.getAttribute('aria-label')).toBeTruthy();
    });
  });
});
