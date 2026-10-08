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

  it('should set aria-hidden="true" on trigger button mat-icon', () => {
    const iconElement = fixture.nativeElement.querySelector('button mat-icon');

    expect(iconElement.getAttribute('aria-hidden')).toBe('true');
  });

  it('should set aria-hidden="true" and aria-current on theme menu item buttons', () => {
    const triggerButton = fixture.nativeElement.querySelector('button[aria-haspopup="menu"]');

    triggerButton.click();
    fixture.detectChanges();

    const menuItems = Array.from(
      document.querySelectorAll<HTMLButtonElement>('.mat-mdc-menu-item')
    );

    expect(menuItems.length).toBeGreaterThan(0);

    const activeThemeId = (
      component as unknown as { matThemeToggleService: { selectedTheme: () => { id: string } } }
    ).matThemeToggleService.selectedTheme().id;

    const themes = (
      component as unknown as { matThemeToggleService: { getThemes: () => { id: string }[] } }
    ).matThemeToggleService.getThemes();

    menuItems.forEach((menuItem, index) => {
      const icon = menuItem.querySelector('mat-icon');

      expect(icon?.getAttribute('aria-hidden')).toBe('true');

      const isSelected = themes[index].id === activeThemeId;

      if (isSelected) {
        expect(menuItem.getAttribute('aria-current')).toBe('true');
      } else {
        expect(menuItem.hasAttribute('aria-current')).toBe(false);
      }
    });
  });
});
