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

  it('should have aria-hidden="true" on the toggle button icon', () => {
    const iconElement = fixture.nativeElement.querySelector('button mat-icon');
    expect(iconElement).toBeTruthy();
    expect(iconElement.getAttribute('aria-hidden')).toBe('true');
  });
});
