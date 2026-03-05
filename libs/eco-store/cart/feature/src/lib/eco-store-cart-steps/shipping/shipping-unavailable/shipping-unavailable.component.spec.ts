import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { axe } from 'jest-axe';
import { ShippingUnavailableComponent } from './shipping-unavailable.component';

describe('ShippingUnavailableComponent', () => {
  let component: ShippingUnavailableComponent;
  let fixture: ComponentFixture<ShippingUnavailableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingUnavailableComponent, TranslateModule.forRoot()],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ShippingUnavailableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    fixture.detectChanges();
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
