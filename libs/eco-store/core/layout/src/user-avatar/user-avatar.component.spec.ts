import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PocketBaseImageUrlPipe } from '@plastik/eco-store/shared/utils';
import { SharedImgContainerComponent } from '@plastik/shared/img-container';
import { axe } from 'jest-axe';
import { UserAvatarComponent } from './user-avatar.component';

/* eslint-disable @angular-eslint/component-selector */
@Component({
  selector: 'plastik-img-container',
  template: '',
  standalone: true,
})
/* eslint-enable @angular-eslint/component-selector */
class MockSharedImgContainerComponent {
  @Input() src: any;
  @Input() title: any;
  @Input() dimensions: any;
}

describe('UserAvatarComponent', () => {
  let component: UserAvatarComponent;
  let fixture: ComponentFixture<UserAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAvatarComponent, PocketBaseImageUrlPipe],
    })
      .overrideComponent(UserAvatarComponent, {
        remove: { imports: [SharedImgContainerComponent] },
        add: { imports: [MockSharedImgContainerComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(UserAvatarComponent);
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
