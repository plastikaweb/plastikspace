import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PocketBaseImageUrlPipe } from '@plastik/eco-store/shared/utils';
import { ImageDimensions, SharedImgContainerComponent } from '@plastik/shared/img-container';
import { axe } from 'jest-axe';
import { EcoUserAvatarComponent } from './user-avatar.component';

/* eslint-disable @angular-eslint/component-selector */
@Component({
  selector: 'plastik-img-container',
  template: '',
  standalone: true,
})
/* eslint-enable @angular-eslint/component-selector */
class MockSharedImgContainerComponent {
  src = input<string | null>(null);
  title = input<string>('');
  dimensions = input<ImageDimensions>();
  thumbSizes = input<number[]>([100, 300, 500, 750, 1600]);
  lcpImage = input<boolean>(false);
}

describe('EcoUserAvatarComponent', () => {
  let component: EcoUserAvatarComponent;
  let fixture: ComponentFixture<EcoUserAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoUserAvatarComponent, PocketBaseImageUrlPipe],
    })
      .overrideComponent(EcoUserAvatarComponent, {
        remove: { imports: [SharedImgContainerComponent] },
        add: { imports: [MockSharedImgContainerComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(EcoUserAvatarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('user', { id: '1', collectionId: 'users' });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display initials if avatar is missing', () => {
    fixture.componentRef.setInput('user', { id: '1', collectionId: 'users', avatar: '' });
    fixture.componentRef.setInput('initials', 'JD');
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const initialsSpan = element.querySelector('span');
    expect(initialsSpan).toBeTruthy();
    expect(initialsSpan?.textContent?.trim()).toBe('JD');
  });

  it('should display image container if avatar is present', () => {
    fixture.componentRef.setInput('user', { id: '1', collectionId: 'users', avatar: 'avatar.jpg' });
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const imgContainer = element.querySelector('plastik-img-container');
    expect(imgContainer).toBeTruthy();
  });

  describe('Accessibility', () => {
    it('should have no violations with initials fallback', async () => {
      fixture.componentRef.setInput('user', { id: '1', collectionId: 'users', avatar: '' });
      fixture.componentRef.setInput('initials', 'JD');
      fixture.detectChanges();
      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with image avatar', async () => {
      fixture.componentRef.setInput('user', {
        id: '1',
        collectionId: 'users',
        avatar: 'avatar.jpg',
      });
      fixture.detectChanges();
      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });
  });
});
