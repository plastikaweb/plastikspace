import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { provideTranslateService, TranslatePipe } from '@ngx-translate/core';
import { SharedCountdownUiComponent } from '@plastik/shared/countdown';
import { CountdownService } from '@plastik/shared/countdown/util';
import { MockPipe } from 'ng-mocks';
import { StoreWindowComponent } from './store-window.component';

describe('StoreWindowComponent', () => {
  let component: StoreWindowComponent;
  let fixture: ComponentFixture<StoreWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StoreWindowComponent,
        MatChipsModule,
        MatIconModule,
        MatTooltipModule,
        MockPipe(TranslatePipe),
        SharedCountdownUiComponent,
      ],
      providers: [
        provideTranslateService(),
        {
          provide: CountdownService,
          useValue: {
            createCountdown: () => ({
              text: () => '',
              data: () => null,
              isExpired: () => false,
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StoreWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render OPEN status correctly with sr-only for screen readers and hidden for visual users on mobile/tablet', () => {
    fixture.componentRef.setInput('status', 'OPEN');
    fixture.detectChanges();

    const chip = fixture.nativeElement.querySelector('.status-chip');
    expect(chip).toBeTruthy();
    expect(chip.classList).toContain('open');

    const srOnly = fixture.nativeElement.querySelector('.sr-only');
    const visual = fixture.nativeElement.querySelector('span[aria-hidden="true"]');

    expect(srOnly.textContent).toContain('store.status.open');
    expect(visual.textContent).toContain('store.status.open');

    expect(visual.classList).toContain('hidden');
    expect(visual.classList).toContain('lg:flex');
  });

  it('should render CLOSED status correctly', () => {
    fixture.componentRef.setInput('status', 'CLOSED');
    fixture.detectChanges();

    const chip = fixture.nativeElement.querySelector('.status-chip');
    expect(chip).toBeTruthy();
    expect(chip.classList).toContain('closed');
    expect(chip.textContent).toContain('store.status.closed');
  });

  it('should render OPENING_SOON status correctly', () => {
    fixture.componentRef.setInput('status', 'OPENING_SOON');
    fixture.detectChanges();

    const chip = fixture.nativeElement.querySelector('.status-chip');
    expect(chip).toBeTruthy();
    expect(chip.classList).toContain('soon');
    expect(chip.textContent).toContain('store.status.openingSoon');
  });
});
