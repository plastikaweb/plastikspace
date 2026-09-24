import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

import { MatThemeToggleComponent } from './mat-theme-toggle.component';

describe('MatThemeToggleComponent', () => {
  let component: MatThemeToggleComponent;
  let fixture: ComponentFixture<MatThemeToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatThemeToggleComponent, TranslateModule.forRoot(), NoopAnimationsModule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(MatThemeToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set aria-hidden="true" on main toggle icon', () => {
    const icon: HTMLElement = fixture.nativeElement.querySelector('button[matIconButton] mat-icon');

    expect(icon).toBeTruthy();
    expect(icon.getAttribute('aria-hidden')).toBe('true');
  });

  it('should open theme menu and mark selected theme with aria-current="true"', async () => {
    const triggerBtn = fixture.debugElement.query(By.css('button[matIconButton]'));

    triggerBtn.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const menuButtons = Array.from(
      document.querySelectorAll<HTMLButtonElement>('.mat-mdc-menu-panel button[mat-menu-item]')
    );

    expect(menuButtons.length).toBeGreaterThan(0);

    const selectedMenuButton = menuButtons.find(btn => btn.getAttribute('aria-current') === 'true');

    expect(selectedMenuButton).toBeTruthy();

    const icons = Array.from(
      document.querySelectorAll<HTMLElement>('.mat-mdc-menu-panel mat-icon')
    );

    icons.forEach(icon => {
      expect(icon.getAttribute('aria-hidden')).toBe('true');
    });
  });
});
