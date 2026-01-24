import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EcoStoreCartComponent } from './eco-store-cart.component';
import { provideTranslateService } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import { axe, toHaveNoViolations } from 'jest-axe';

describe('EcoStoreCartComponent', () => {
  let component: EcoStoreCartComponent;
  let fixture: ComponentFixture<EcoStoreCartComponent>;

  beforeEach(async () => {
    expect.extend(toHaveNoViolations);
    await TestBed.configureTestingModule({
      imports: [EcoStoreCartComponent],
      providers: [provideRouter([]), provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreCartComponent);
    component = fixture.componentInstance;
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
