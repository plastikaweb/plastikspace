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

  it('should render the language icon', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const icon = compiled.querySelector('mat-icon');

    expect(icon?.textContent).toContain('language');
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

  it('should set aria-current="true" on current language menu item when opened', () => {
    const trigger: HTMLButtonElement = fixture.nativeElement.querySelector('button[matIconButton]');
    trigger.click();
    fixture.detectChanges();

    const menuItems = document.querySelectorAll<HTMLButtonElement>('button[mat-menu-item]');
    expect(menuItems.length).toBe(2);
    expect(menuItems[0].getAttribute('aria-current')).toBe('true');
    expect(menuItems[1].getAttribute('aria-current')).toBeNull();
  });
});
