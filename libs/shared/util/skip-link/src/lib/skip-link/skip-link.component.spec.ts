import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { SkipLinkComponent } from './skip-link.component';

describe('SkipLinkComponent', () => {
  let component: SkipLinkComponent;
  let fixture: ComponentFixture<SkipLinkComponent>;
  let liveAnnouncer: LiveAnnouncer;
  let translateService: TranslateService;
  let doc: Document;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkipLinkComponent, TranslateModule.forRoot()],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SkipLinkComponent);
    component = fixture.componentInstance;
    liveAnnouncer = TestBed.inject(LiveAnnouncer);
    translateService = TestBed.inject(TranslateService);
    doc = TestBed.inject(DOCUMENT);

    translateService.setTranslation('ca', {
      common: {
        a11y: {
          skipToContent: 'Saltar al contingut principal',
          skipToContentAnnounce: 'Has navegat al contingut principal',
        },
      },
    });
    translateService.use('ca');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render translated skip link text', () => {
    const anchor = fixture.nativeElement.querySelector('a');
    expect(anchor.textContent.trim()).toBe('Saltar al contingut principal');
  });

  it('should navigate to #mainContent and announce localized message when skipToMainContent is triggered', async () => {
    const mainContentEl = doc.createElement('div');
    mainContentEl.id = 'mainContent';
    mainContentEl.tabIndex = -1;
    mainContentEl.scrollIntoView = vi.fn();
    doc.body.appendChild(mainContentEl);

    const announceSpy = vi.spyOn(liveAnnouncer, 'announce');
    const focusSpy = vi.spyOn(mainContentEl, 'focus');

    const event = new MouseEvent('click');
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    const anchor = fixture.nativeElement.querySelector('a');
    anchor.dispatchEvent(event);

    await fixture.whenStable();

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(focusSpy).toHaveBeenCalled();
    expect(announceSpy).toHaveBeenCalledWith('Has navegat al contingut principal', 'assertive');

    doc.body.removeChild(mainContentEl);
  });
});
