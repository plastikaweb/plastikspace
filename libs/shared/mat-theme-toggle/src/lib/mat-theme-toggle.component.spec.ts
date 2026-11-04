import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

import { MatThemeToggleComponent } from './mat-theme-toggle.component';

describe('MatThemeToggleComponent', () => {
  let component: MatThemeToggleComponent;
  let fixture: ComponentFixture<MatThemeToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatThemeToggleComponent, TranslateModule.forRoot()],
      providers: [provideZonelessChangeDetection(), provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(MatThemeToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set aria-current="true" on active theme menu item when opened', () => {
    const trigger: HTMLButtonElement = fixture.nativeElement.querySelector('button[matIconButton]');
    trigger.click();
    fixture.detectChanges();

    const menuItems = document.querySelectorAll<HTMLButtonElement>('button[mat-menu-item]');
    expect(menuItems.length).toBeGreaterThan(0);
    const activeItem = Array.from(menuItems).find(item => item.getAttribute('aria-current') === 'true');
    expect(activeItem).toBeTruthy();
  });
});
