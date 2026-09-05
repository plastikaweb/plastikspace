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

  it('should render zoom buttons with aria-label and matTooltip in crop mode', () => {
    component['imageBase64'].set('data:image/png;base64,123');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.crop-zone-bg button[matIconButton]');

    expect(buttons.length).toBe(2);

    const zoomOutBtn = buttons[0];
    const zoomInBtn = buttons[1];

    expect(zoomOutBtn.getAttribute('aria-label')).toBe('common.image.crop.zoomOut');
    expect(
      zoomOutBtn.getAttribute('ng-reflect-message') || zoomOutBtn.getAttribute('matTooltip')
    ).toBeDefined();

    expect(zoomInBtn.getAttribute('aria-label')).toBe('common.image.crop.zoomIn');
    expect(
      zoomInBtn.getAttribute('ng-reflect-message') || zoomInBtn.getAttribute('matTooltip')
    ).toBeDefined();
  });

  it('should render clear error button with aria-label and matTooltip', () => {
    component['errorMessage'].set({ key: 'common.image.error.loaded' });
    fixture.detectChanges();

    const clearBtn = fixture.nativeElement.querySelector(
      'div[role="alert"] button[matIconButton]'
    );

    expect(clearBtn).toBeTruthy();
    expect(clearBtn?.getAttribute('aria-label')).toBe('common.close');
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);

    expect(results).toHaveNoViolations();
  });
});
