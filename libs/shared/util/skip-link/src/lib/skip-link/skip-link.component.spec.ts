import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DOCUMENT, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { SkipLinkComponent } from './skip-link.component';

describe('SkipLinkComponent', () => {
  let component: SkipLinkComponent;
  let fixture: ComponentFixture<SkipLinkComponent>;
  let announceSpy: ReturnType<typeof vi.fn>;
  let navigateByUrlSpy: ReturnType<typeof vi.fn>;
  let mainContentEl: HTMLElement;

  beforeEach(async () => {
    announceSpy = vi.fn();
    navigateByUrlSpy = vi.fn().mockResolvedValue(true);

    mainContentEl = document.createElement('main');
    mainContentEl.id = 'mainContent';
    mainContentEl.tabIndex = -1;
    mainContentEl.focus = vi.fn();
    mainContentEl.scrollIntoView = vi.fn();
    document.body.appendChild(mainContentEl);

    await TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideTranslateService(),
        { provide: LiveAnnouncer, useValue: { announce: announceSpy } },
        {
          provide: Router,
          useValue: {
            url: '/',
            parseUrl: (url: string) => ({ url, fragment: '' }),
            navigateByUrl: navigateByUrlSpy,
          },
        },
      ],
      imports: [SkipLinkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkipLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (mainContentEl && document.body.contains(mainContentEl)) {
      document.body.removeChild(mainContentEl);
    }
  });

  it('should create and render translated skip-link text', () => {
    expect(component).toBeTruthy();
    const link = fixture.nativeElement.querySelector('a');

    expect(link.textContent.trim()).toBe('common.a11y.skipToContent');
  });

  it('should focus mainContent and announce localized message on skip link click', async () => {
    const link = fixture.nativeElement.querySelector('a');
    const event = new MouseEvent('click', { cancelable: true });

    vi.spyOn(event, 'preventDefault');

    link.dispatchEvent(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(navigateByUrlSpy).toHaveBeenCalled();

    await fixture.whenStable();

    expect(mainContentEl.focus).toHaveBeenCalled();
    expect(mainContentEl.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
    expect(announceSpy).toHaveBeenCalledWith('common.a11y.navigatedToMainContent', 'assertive');
  });
});
