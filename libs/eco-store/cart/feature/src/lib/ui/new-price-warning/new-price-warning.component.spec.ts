import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { axe } from 'jest-axe';
import { NewPriceWarningComponent } from './new-price-warning.component';

describe('NewPriceWarningComponent', () => {
  let component: NewPriceWarningComponent;
  let fixture: ComponentFixture<NewPriceWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideTranslateService()],
      imports: [NewPriceWarningComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewPriceWarningComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('oldPrice', 100);
    fixture.componentRef.setInput('currentPrice', 120);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
