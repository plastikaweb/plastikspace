import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { axe } from 'vitest-axe';
import { SharedAlertUiComponent } from './shared-alert-ui.component';

describe('SharedAlertUiComponent', () => {
  let fixture: ComponentFixture<SharedAlertUiComponent>;

  /**
   * Creates the component fixture with the given alert type and closable flag.
   * @param {string} type - The semantic alert type.
   * @param {boolean} closable - Whether the close button should be rendered.
   * @returns {ComponentFixture<SharedAlertUiComponent>} The component fixture.
   */
  function createComponent(type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR', closable = false) {
    fixture = TestBed.createComponent(SharedAlertUiComponent);
    fixture.componentRef.setInput('type', type);
    fixture.componentRef.setInput('closable', closable);
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedAlertUiComponent],
    }).compileComponents();
  });

  it('should create', () => {
    createComponent('INFO');
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should apply the correct host class for each type', () => {
    const types = ['INFO', 'WARNING', 'SUCCESS', 'ERROR'] as const;
    for (const type of types) {
      createComponent(type);
      const el: HTMLElement = fixture.nativeElement;
      expect(el.classList).toContain(`plastik-alert--${type.toLowerCase()}`);
    }
  });

  it('should render the correct icon for each type', () => {
    const iconMap = {
      INFO: 'info',
      WARNING: 'warning',
      SUCCESS: 'check_circle',
      ERROR: 'error',
    } as const;

    for (const [type, icon] of Object.entries(iconMap)) {
      createComponent(type as keyof typeof iconMap);
      const matIcon = fixture.debugElement.query(By.css('mat-icon.plastik-alert__icon'));
      expect(matIcon.nativeElement.textContent.trim()).toBe(icon);
    }
  });

  it('should not render the close button when closable is false', () => {
    createComponent('INFO', false);
    const closeBtn = fixture.debugElement.query(By.css('.plastik-alert__close'));
    expect(closeBtn).toBeNull();
  });

  it('should render the close button when closable is true', () => {
    createComponent('INFO', true);
    const closeBtn = fixture.debugElement.query(By.css('.plastik-alert__close'));
    expect(closeBtn).not.toBeNull();
  });

  it('should emit closed event when close button is clicked', () => {
    createComponent('INFO', true);
    const closedSpy = vi.spyOn(fixture.componentInstance.closed, 'emit');
    const closeBtn = fixture.debugElement.query(By.css('.plastik-alert__close'));
    closeBtn.nativeElement.click();
    expect(closedSpy).toHaveBeenCalledOnce();
  });

  it('should have role="alert" on the host', () => {
    createComponent('WARNING');
    expect(fixture.nativeElement.getAttribute('role')).toBe('alert');
  });

  it('should pass accessibility check for INFO type', async () => {
    createComponent('INFO');
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
