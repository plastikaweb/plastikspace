import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { SharedCountdownUiComponent } from './shared-countdown-ui.component';

describe('SharedCountdownUiComponent', () => {
  let component: SharedCountdownUiComponent;
  let fixture: ComponentFixture<SharedCountdownUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedCountdownUiComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedCountdownUiComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display prefix if provided', () => {
    fixture.componentRef.setInput('prefix', 'Starts in');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Starts in');
  });

  it('should render segments correctly', () => {
    fixture.componentRef.setInput('segments', ['1d', '2h', '30m']);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('1d');
    expect(compiled.textContent).toContain('2h');
    expect(compiled.textContent).toContain('30m');
  });

  it('should render separator with animation class', () => {
    fixture.componentRef.setInput('segments', [':']);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const separator = compiled.querySelector('.countdown-separator-test');
    expect(separator).toBeTruthy();
    expect(separator?.textContent).toContain(':');
  });

  it('should apply custom class', () => {
    fixture.componentRef.setInput('class', 'custom-class');
    fixture.detectChanges();
    const pElement = fixture.nativeElement.querySelector('p');
    expect(pElement?.classList).toContain('custom-class');
  });
});
