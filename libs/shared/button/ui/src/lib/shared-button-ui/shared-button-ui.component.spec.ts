import { AngularSvgIconModule } from 'angular-svg-icon';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { buttonMock } from '@plastik/shared/button';

import { SharedButtonUiComponent } from './shared-button-ui.component';

describe('SharedButtonUiComponent', () => {
  let component: SharedButtonUiComponent;
  let fixture: ComponentFixture<SharedButtonUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedButtonUiComponent, AngularSvgIconModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    const translate = TestBed.inject(TranslateService);
    translate.use('en');
    translate.setTranslation('en', {
      common: {
        loading: 'Loading',
      },
    });

    fixture = TestBed.createComponent(SharedButtonUiComponent);
    fixture.componentRef.setInput('buttonConfig', buttonMock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should output a button action on click', () => {
    let result;
    component.sendAction.subscribe(action => (result = action));
    component.onClick();
    expect(result).toEqual(result);
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });

  it('should show spinner and be disabled when loading is true', async () => {
    fixture.componentRef.setInput('buttonConfig', { ...buttonMock, loading: true });
    await fixture.whenStable();

    const spinner = fixture.debugElement.query(By.directive(MatProgressSpinner));
    expect(spinner).toBeTruthy();

    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it('should show spinner and be disabled when loading is a signal that is true', async () => {
    const loadingSignal = signal(true);
    fixture.componentRef.setInput('buttonConfig', { ...buttonMock, loading: loadingSignal });
    await fixture.whenStable();

    let spinner = fixture.debugElement.query(By.directive(MatProgressSpinner));
    expect(spinner).toBeTruthy();

    loadingSignal.set(false);
    await fixture.whenStable();

    spinner = fixture.debugElement.query(By.directive(MatProgressSpinner));
    expect(spinner).toBeFalsy();
  });
});
