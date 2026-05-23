import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { axe } from 'vitest-axe';
import { EcoStorePriceSummaryComponent } from './eco-store-price-summary.component';

describe('EcoStorePriceSummaryComponent', () => {
  let component: EcoStorePriceSummaryComponent;
  let fixture: ComponentFixture<EcoStorePriceSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([]), provideTranslateService()],
      imports: [EcoStorePriceSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStorePriceSummaryComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('subtotal', 100);
    fixture.componentRef.setInput('taxes', 21);
    fixture.componentRef.setInput('total', 121);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
