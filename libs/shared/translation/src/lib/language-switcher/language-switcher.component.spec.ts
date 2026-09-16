import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LanguageSwitcherComponent } from './language-switcher.component';

describe('LanguageSwitcherComponent', () => {
  let component: LanguageSwitcherComponent;
  let fixture: ComponentFixture<LanguageSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageSwitcherComponent, BrowserAnimationsModule],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSwitcherComponent);
    component = fixture.componentInstance;

    // Set required inputs
    fixture.componentRef.setInput('languages', ['ca', 'es']);
    fixture.componentRef.setInput('current', 'ca');

    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the language icon with aria-hidden="true"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const icon = compiled.querySelector('mat-icon');

    expect(icon?.textContent).toContain('language');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
  });

  it('should set aria-hidden on menu icons and aria-current on the selected language menu item when opened', () => {
    const trigger = fixture.nativeElement.querySelector('button[matIconButton]') as HTMLButtonElement;

    trigger.click();
    fixture.detectChanges();

    const menuItems = Array.from(document.querySelectorAll<HTMLButtonElement>('button[mat-menu-item]'));

    expect(menuItems.length).toBe(2);
    expect(menuItems[0].getAttribute('aria-current')).toBe('true');
    expect(menuItems[1].getAttribute('aria-current')).toBeNull();

    const checkIcons = Array.from(document.querySelectorAll('mat-icon[matMenuItemIcon]'));

    checkIcons.forEach(icon => {
      expect(icon.getAttribute('aria-hidden')).toBe('true');
    });
  });

  it('should emit languageChange when a language is selected', () => {
    const emitSpy = vi.spyOn(component.languageChange, 'emit');

    component.onSelect('es');
    expect(emitSpy).toHaveBeenCalledWith('es');
  });

  it('should not emit languageChange if the same language is selected', () => {
    const emitSpy = vi.spyOn(component.languageChange, 'emit');

    component.onSelect('ca');
    expect(emitSpy).not.toHaveBeenCalled();
  });
});
