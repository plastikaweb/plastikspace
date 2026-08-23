import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
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

  it('should sync aria-label with matTooltip on the toggle button', () => {
    const button = fixture.debugElement.query(By.css('button[matIconButton]'));
    const tooltip = button.injector.get(MatTooltip);

    expect(button.nativeElement.getAttribute('aria-label')).toBe('common.theme.toggleAriaLabel');
    expect(tooltip.message).toBe('common.theme.toggleTooltip');
  });

  it('should render theme options in menu with checkmark and aria-current on active theme', () => {
    const menuTrigger = fixture.debugElement
      .query(By.directive(MatMenuTrigger))
      .injector.get(MatMenuTrigger);
    menuTrigger.openMenu();
    fixture.detectChanges();

    const menuItems = fixture.debugElement.queryAll(By.css('button[mat-menu-item]'));
    expect(menuItems.length).toBe(3);

    // Default theme in service is 'system' (index 2)
    const systemItem = menuItems[2];
    expect(systemItem.nativeElement.getAttribute('aria-current')).toBe('true');

    const checkIcon = systemItem.query(By.css('mat-icon[matMenuItemIcon]'));
    expect(checkIcon).toBeTruthy();
    expect(checkIcon.nativeElement.textContent.trim()).toBe('check');
  });
});
