import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
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
        MockPipe(TranslatePipe, (v) => v),
        SharedCountdownUiComponent,
      ],
      providers: [
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

  it('should render OPEN status correctly', () => {
    fixture.componentRef.setInput('status', 'OPEN');
    fixture.detectChanges();

    const chip = fixture.nativeElement.querySelector('.status-chip');
    expect(chip).toBeTruthy();
    expect(chip.classList).toContain('open');
    expect(chip.textContent).toContain('store.status.open');
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
