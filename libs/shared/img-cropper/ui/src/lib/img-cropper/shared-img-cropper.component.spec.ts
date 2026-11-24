import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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

  describe('crop step', () => {
    const button = (label: string): HTMLButtonElement =>
      fixture.nativeElement.querySelector(`button[aria-label="${label}"]`);
    const isDisabled = (label: string) => button(label).getAttribute('aria-disabled') === 'true';
    const cropper = () => fixture.debugElement.query(By.css('image-cropper')).componentInstance;
    const click = (label: string, times = 1) => {
      for (let i = 0; i < times; i++) {
        button(label).click();
        fixture.detectChanges();
      }
    };

    beforeEach(() => {
      component['imageBase64'].set('data:image/png;base64,123');
      fixture.detectChanges();
    });

    it('should name every icon-only control (A11Y-016)', () => {
      component['errorMessage'].set({ key: 'common.image.error.loaded' });
      fixture.detectChanges();

      for (const label of [
        'common.image.crop.zoomOut',
        'common.image.crop.zoomIn',
        'common.image.crop.moveLeft',
        'common.image.crop.moveUp',
        'common.image.crop.moveDown',
        'common.image.crop.moveRight',
        'common.close',
      ]) {
        expect(button(label), label).toBeTruthy();
      }
      expect(
        fixture.nativeElement.querySelector('input[matSliderThumb]').getAttribute('aria-label')
      ).toBe('common.image.crop.zoom');
      expect(fixture.nativeElement.querySelector('[role="group"]').getAttribute('aria-label')).toBe(
        'common.image.crop.move'
      );
    });

    it('should keep the zoom between 1 and 4 in steps of 0.1', () => {
      expect(isDisabled('common.image.crop.zoomOut')).toBe(true);
      click('common.image.crop.zoomOut');
      expect(component['zoom']()).toBe(1);

      click('common.image.crop.zoomIn', 3);
      expect(component['zoom']()).toBe(1.3);

      component.onZoomChange(9);
      fixture.detectChanges();
      expect(component['zoom']()).toBe(4);
      expect(isDisabled('common.image.crop.zoomIn')).toBe(true);
    });

    it('should keep the pan buttons disabled until the cropper has laid out the image', () => {
      for (const label of ['moveLeft', 'moveUp', 'moveDown', 'moveRight']) {
        expect(isDisabled(`common.image.crop.${label}`), label).toBe(true);
      }
    });

    it('should move the image without dragging and stop before it uncovers the crop area (A11Y-024)', () => {
      // A 300 × 200 image with a 200 × 200 crop area in the middle: it can move 50 px each way
      // horizontally, and not at all vertically until zoomed.
      cropper().cropperReady.emit({ width: 300, height: 200 });
      cropper().cropperChange.emit({ x1: 50, y1: 0, x2: 250, y2: 200 });
      fixture.detectChanges();

      expect(isDisabled('common.image.crop.moveLeft')).toBe(false);
      expect(isDisabled('common.image.crop.moveRight')).toBe(false);
      expect(isDisabled('common.image.crop.moveUp')).toBe(true);
      expect(isDisabled('common.image.crop.moveDown')).toBe(true);

      click('common.image.crop.moveRight', 6);
      expect(cropper().transform).toEqual({
        scale: 1,
        translateH: 50,
        translateV: 0,
        translateUnit: 'px',
      });
      expect(isDisabled('common.image.crop.moveRight')).toBe(true);

      click('common.image.crop.moveLeft', 20);
      expect(cropper().transform.translateH).toBe(-50);

      component.onZoomChange(2);
      fixture.detectChanges();
      click('common.image.crop.moveUp');
      expect(cropper().transform).toEqual({
        scale: 2,
        translateH: -50,
        translateV: -20,
        translateUnit: 'px',
      });
    });

    it('should keep the offset of a drag when zooming afterwards', () => {
      cropper().transformChange.emit({ scale: 1, translateH: -30, translateV: 12 });
      click('common.image.crop.zoomIn');

      expect(cropper().transform).toEqual({
        scale: 1.1,
        translateH: -30,
        translateV: 12,
        translateUnit: 'px',
      });
    });

    it('should start a new image centred and unzoomed', () => {
      cropper().transformChange.emit({ scale: 1, translateH: -30, translateV: 12 });
      component.onZoomChange(2);
      component.onBackToUpload();
      component['imageBase64'].set('data:image/png;base64,456');
      fixture.detectChanges();

      expect(cropper().transform).toEqual({
        scale: 1,
        translateH: 0,
        translateV: 0,
        translateUnit: 'px',
      });
      expect(isDisabled('common.image.crop.moveLeft')).toBe(true);
    });

    it('should have no accessibility violations', async () => {
      const results = await axe(fixture.nativeElement);

      expect(results).toHaveNoViolations();
    });
  });
});
