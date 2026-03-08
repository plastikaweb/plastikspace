import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CountdownService } from '@plastik/shared/countdown/util';
import { axe } from 'vitest-axe';
import { StoreStatusBannerComponent } from './store-status-banner.component';

describe('StoreStatusBannerComponent', () => {
  let component: StoreStatusBannerComponent;
  let fixture: ComponentFixture<StoreStatusBannerComponent>;

  const mockCountdownService = {
    createCountdown: vi.fn().mockReturnValue({
      text: signal('00:00:00'),
    }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreStatusBannerComponent, TranslateModule.forRoot()],
      providers: [{ provide: CountdownService, useValue: mockCountdownService }],
    }).compileComponents();

    fixture = TestBed.createComponent(StoreStatusBannerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should calculate title based on status', () => {
    fixture.componentRef.setInput('status', 'CLOSED');
    fixture.detectChanges();
    expect((component as any).title()).toBe('store.status.statusBanner.closedTitle');

    fixture.componentRef.setInput('status', 'OPENING_SOON');
    fixture.detectChanges();
    expect((component as any).title()).toBe('store.status.statusBanner.openingSoonTitle');
  });

  it('should calculate icon based on status', () => {
    fixture.componentRef.setInput('status', 'CLOSED');
    fixture.detectChanges();
    expect((component as any).icon()).toBe('lock_clock');

    fixture.componentRef.setInput('status', 'OPENING_SOON');
    fixture.detectChanges();
    expect((component as any).icon()).toBe('hourglass_top');
  });

  it('should calculate description based on status', () => {
    fixture.componentRef.setInput('status', 'OPENING_SOON');
    fixture.detectChanges();
    expect((component as any).description()).toEqual({
      key: 'store.status.statusBanner.openingSoonDescription',
    });
  });

  it('should calculate segments from countdown service', () => {
    fixture.detectChanges();
    expect((component as any).segments()).toEqual(['00', ':', '00', ':', '00']);
  });

  describe('Accessibility', () => {
    it('should have no violations with OPENING_SOON status', async () => {
      fixture.componentRef.setInput('status', 'OPENING_SOON');
      fixture.detectChanges();
      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with CLOSED status', async () => {
      fixture.componentRef.setInput('status', 'CLOSED');
      fixture.detectChanges();
      const results = await axe(fixture.nativeElement);
      expect(results).toHaveNoViolations();
    });
  });
});
