import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

import { MatThemeToggleComponent } from './mat-theme-toggle.component';

describe('MatThemeToggleComponent', () => {
  let component: MatThemeToggleComponent;
  let fixture: ComponentFixture<MatThemeToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatThemeToggleComponent, NoopAnimationsModule, TranslateModule.forRoot()],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(MatThemeToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set aria-current="true" on selected theme menu item', () => {
    const trigger = fixture.nativeElement.querySelector(
      'button[matIconButton]'
    ) as HTMLButtonElement;

    trigger.click();
    fixture.detectChanges();

    const menuItems = Array.from(
      document.querySelectorAll<HTMLButtonElement>('button[mat-menu-item]')
    );

    expect(menuItems.length).toBeGreaterThan(0);

    const activeItem = menuItems.find(
      menuOption => menuOption.getAttribute('aria-current') === 'true'
    );

    expect(activeItem).toBeTruthy();
  });
});
