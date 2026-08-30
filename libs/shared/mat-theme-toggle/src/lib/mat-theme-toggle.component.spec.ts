import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { MatThemeToggleComponent } from './mat-theme-toggle.component';

describe('MatThemeToggleComponent', () => {
  let component: MatThemeToggleComponent;
  let fixture: ComponentFixture<MatThemeToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatThemeToggleComponent, TranslateModule.forRoot()],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(MatThemeToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set aria-current="true" on the active theme menu item', async () => {
    const toggleButton: HTMLButtonElement | null = fixture.nativeElement.querySelector(
      'button[aria-haspopup="menu"]'
    );
    toggleButton?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const menuItems = Array.from(
      document.querySelectorAll<HTMLButtonElement>('button[mat-menu-item]')
    );
    expect(menuItems.length).toBeGreaterThan(0);

    const activeMenuItem = menuItems.find(item => item.getAttribute('aria-current') === 'true');
    expect(activeMenuItem).toBeTruthy();
  });
});
