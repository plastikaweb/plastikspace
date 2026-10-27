import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { SkipLinkComponent } from './skip-link.component';

describe('SkipLinkComponent', () => {
  let component: SkipLinkComponent;
  let fixture: ComponentFixture<SkipLinkComponent>;
  let mockRouter: Partial<Router>;
  let mockLiveAnnouncer: { announce: ReturnType<typeof vi.fn> };
  let mockDocument: Document;

  beforeEach(async () => {
    mockRouter = {
      url: '/test-path',
      parseUrl: vi.fn().mockReturnValue({ fragment: null }),
      navigateByUrl: vi.fn().mockResolvedValue(true),
    };

    mockLiveAnnouncer = {
      announce: vi.fn(),
    };

    mockDocument = document.implementation.createHTMLDocument();

    await TestBed.configureTestingModule({
      imports: [SkipLinkComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: Router, useValue: mockRouter },
        { provide: LiveAnnouncer, useValue: mockLiveAnnouncer },
        { provide: DOCUMENT, useValue: mockDocument },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SkipLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle skipToMainContent when mainContent element exists', async () => {
    const mainContentEl = mockDocument.createElement('main');

    mainContentEl.id = 'mainContent';
    mainContentEl.focus = vi.fn();
    mainContentEl.scrollIntoView = vi.fn();
    mockDocument.body.appendChild(mainContentEl);

    const event = new MouseEvent('click');
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    const button = fixture.nativeElement.querySelector('button');

    button.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).toHaveBeenCalled();

    await Promise.resolve();

    expect(mainContentEl.focus).toHaveBeenCalled();
    expect(mainContentEl.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
    expect(mockLiveAnnouncer.announce).toHaveBeenCalledWith(
      'Has navegat al contingut principal',
      'assertive'
    );
  });

  it('should handle skipToMainContent gracefully when mainContent element does not exist', async () => {
    const event = new MouseEvent('click');
    const button = fixture.nativeElement.querySelector('button');

    button.dispatchEvent(event);

    expect(mockRouter.navigateByUrl).toHaveBeenCalled();

    await Promise.resolve();

    expect(mockLiveAnnouncer.announce).not.toHaveBeenCalled();
  });
});
