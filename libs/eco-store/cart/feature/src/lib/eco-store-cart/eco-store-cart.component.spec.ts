import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { axe } from 'vitest-axe';
import { EcoStoreCartComponent } from './eco-store-cart.component';

describe('EcoStoreCartComponent', () => {
  let component: EcoStoreCartComponent;
  let fixture: ComponentFixture<EcoStoreCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreCartComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        { provide: ecoStoreTenantStore, useValue: mockEcoStoreTenantStore },
      ],
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
    expect(results.violations).toEqual([]);
  });
});
