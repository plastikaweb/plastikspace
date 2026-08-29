import { IMAGE_LOADER } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatIcon, MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { PwaInstallService } from '../../services/pwa-install.service';
import { PwaPromptComponent } from './pwa-prompt.component';

describe('PwaPromptComponent', () => {
  let component: PwaPromptComponent;
  let fixture: ComponentFixture<PwaPromptComponent>;
  let cdr: ChangeDetectorRef;
  let dismissedSubject: Subject<void>;

  const mockPwaService = {
    isIos: vi.fn().mockReturnValue(false),
    isIosAndNotSafari: vi.fn().mockReturnValue(false),
    isOldIos: vi.fn().mockReturnValue(false),
    installPwa: vi.fn().mockResolvedValue('accepted'),
    dismissForLater: vi.fn(),
  };

  const mockBottomSheetRef = { dismiss: vi.fn(), afterDismissed: vi.fn() };

  const mockData = {
    name: 'Eco Shop',
    logo: 'shop.png',
    defaultLogo: 'eco_logo',
  };

  const mockMatIconRegistry = {
    getNamedSvgIcon: vi
      .fn()
      .mockReturnValue(of(document.createElementNS('http://www.w3.org/2000/svg', 'svg'))),
    addSvgIconLiteral: vi.fn(),
    getDefaultFontSetClass: vi.fn().mockReturnValue(['material-icons']),
    getGroupConfig: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    // Fresh subject per test so subjects don't bleed across tests.
    dismissedSubject = new Subject<void>();
    mockBottomSheetRef.dismiss.mockImplementation(() => dismissedSubject.next());
    mockBottomSheetRef.afterDismissed.mockReturnValue(dismissedSubject.asObservable());

    mockPwaService.isIos.mockReturnValue(false);
    mockPwaService.isIosAndNotSafari.mockReturnValue(false);
    mockPwaService.isOldIos.mockReturnValue(false);
    mockPwaService.installPwa.mockResolvedValue('accepted');

    await TestBed.configureTestingModule({
      imports: [PwaPromptComponent, MatIconModule, TranslateModule.forRoot()],
      providers: [
        { provide: PwaInstallService, useValue: mockPwaService },
        { provide: MatBottomSheetRef, useValue: mockBottomSheetRef },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: mockData },
        { provide: MatIconRegistry, useValue: mockMatIconRegistry },
        {
          provide: IMAGE_LOADER,
          useFactory: () => (src: string) => `https://test.io/${src}`,
        },
        provideHttpClient(),
      ],
    }).compileComponents();
  });

  /**
   * Creates a new test component fixture.
   */
  function createComponent() {
    fixture = TestBed.createComponent(PwaPromptComponent);
    component = fixture.componentInstance;
    cdr = fixture.componentRef.injector.get(ChangeDetectorRef);
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  describe('Identity rendering', () => {
    it('renders the custom logo when provided', () => {
      createComponent();
      const img = fixture.debugElement.query(By.css('plastik-img-container'));

      expect(img).toBeTruthy();
      expect(img.componentInstance.src()).toBe(mockData.logo);
    });

    it('renders the default icon when logo is missing', () => {
      TestBed.overrideProvider(MAT_BOTTOM_SHEET_DATA, {
        useValue: { ...mockData, logo: undefined },
      });
      createComponent();
      const iconDebug = fixture.debugElement.query(By.directive(MatIcon));

      expect(iconDebug).toBeTruthy();
      expect(iconDebug.componentInstance.svgIcon).toBe(mockData.defaultLogo);
    });

    it('uses data.name in the heading', () => {
      createComponent();
      const h2 = fixture.nativeElement.querySelector('h2');

      expect(h2.textContent).toContain(mockData.name);
    });

    it('falls back to translated title if data.name is missing', () => {
      TestBed.overrideProvider(MAT_BOTTOM_SHEET_DATA, { useValue: { ...mockData, name: '' } });
      createComponent();
      const h2 = fixture.nativeElement.querySelector('h2');

      expect(h2.textContent).toContain('common.pwa.title');
    });
  });

  describe('install()', () => {
    beforeEach(() => createComponent());

    it('calls installPwa() and dismisses the sheet on completion', async () => {
      component.install();
      await fixture.whenStable();
      expect(mockPwaService.installPwa).toHaveBeenCalled();
      expect(mockBottomSheetRef.dismiss).toHaveBeenCalled();
    });

    it('does not call dismissForLater — installPwa() manages its own state', async () => {
      component.install();
      await fixture.whenStable();
      expect(mockPwaService.dismissForLater).not.toHaveBeenCalled();
    });

    it('dismisses even when installPwa returns dismissed', async () => {
      mockPwaService.installPwa.mockResolvedValueOnce('dismissed');
      component.install();
      await fixture.whenStable();
      expect(mockBottomSheetRef.dismiss).toHaveBeenCalled();
    });
  });

  describe('later()', () => {
    it('dismisses the sheet and calls dismissForLater via afterDismissed', () => {
      createComponent();
      component.later();
      expect(mockBottomSheetRef.dismiss).toHaveBeenCalled();
      expect(mockPwaService.dismissForLater).toHaveBeenCalled();
    });
  });

  describe('close()', () => {
    it('dismisses the sheet and calls dismissForLater via afterDismissed', () => {
      createComponent();
      component.close();
      expect(mockBottomSheetRef.dismiss).toHaveBeenCalled();
      expect(mockPwaService.dismissForLater).toHaveBeenCalled();
      expect(mockPwaService.installPwa).not.toHaveBeenCalled();
    });
  });

  describe('backdrop / external dismiss', () => {
    it('calls dismissForLater when the sheet is dismissed without an explicit action', () => {
      createComponent();
      dismissedSubject.next(); // simulate backdrop tap or swipe-to-dismiss
      expect(mockPwaService.dismissForLater).toHaveBeenCalled();
    });

    it('does not call dismissForLater a second time when install preceded the dismiss', async () => {
      createComponent();
      component.install();
      await fixture.whenStable(); // dismiss() fires → dismissedSubject.next()
      expect(mockPwaService.dismissForLater).not.toHaveBeenCalled();
    });
  });

  describe('template — Android (default)', () => {
    beforeEach(() => createComponent());

    it('renders an install and a later button', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button');

      expect(buttons.length).toBe(2);
      expect(buttons[0].textContent).toContain('common.pwa.install');
      expect(buttons[1].textContent).toContain('common.pwa.later');
    });

    it('does not render the iOS step list', () => {
      expect(fixture.nativeElement.querySelector('ol')).toBeNull();
    });
  });

  describe('template — iOS Safari', () => {
    beforeEach(() => {
      mockPwaService.isIos.mockReturnValue(true);
      mockPwaService.isIosAndNotSafari.mockReturnValue(false);
      createComponent();
    });

    it('renders three installation steps', () => {
      const steps = fixture.nativeElement.querySelectorAll('ol li');

      expect(steps.length).toBe(3);
    });

    it('renders step 1 for modern iOS by default', () => {
      const step1 = fixture.nativeElement.querySelector('ol li');

      expect(step1.textContent).toContain('common.pwa.iosInstructionsStep1');
    });

    it('renders step 1 for old iOS when isOldIos is true', () => {
      mockPwaService.isOldIos.mockReturnValue(true);
      cdr.markForCheck();
      fixture.detectChanges();
      const step1 = fixture.nativeElement.querySelector('ol li');

      expect(step1.textContent).toContain('common.pwa.iosInstructionsStep1Old');
    });

    it('renders a single close button (no install button)', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button');

      expect(buttons.length).toBe(1);
      expect(buttons[0].textContent).toContain('common.pwa.close');
    });
  });

  describe('template — iOS non-Safari', () => {
    beforeEach(() => {
      mockPwaService.isIosAndNotSafari.mockReturnValue(true);
      createComponent();
    });

    it('shows the Safari required message', () => {
      expect(fixture.nativeElement.textContent).toContain('common.pwa.iosSafariRequired');
    });

    it('does not render the iOS step list', () => {
      expect(fixture.nativeElement.querySelector('ol')).toBeNull();
    });

    it('renders a single close button', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button');

      expect(buttons.length).toBe(1);
    });
  });

  describe('accessibility', () => {
    it('has a dialog role and proper aria-label', () => {
      createComponent();
      const container = fixture.nativeElement.querySelector('div[role="dialog"]');

      expect(container).toBeTruthy();
      expect(container.getAttribute('aria-label')).toBe('common.pwa.title');
    });
  });
});
