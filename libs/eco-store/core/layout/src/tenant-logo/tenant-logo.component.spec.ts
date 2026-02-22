import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { EcoTenantLogoComponent } from './tenant-logo.component';

const mockTenant = mockEcoStoreTenantStore.tenant();
const mockTenantNoLogo = { ...mockTenant, logo: undefined };

describe('TenantLogoComponent', () => {
  let component: EcoTenantLogoComponent;
  let fixture: ComponentFixture<EcoTenantLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoTenantLogoComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoTenantLogoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display image when tenant has logo', () => {
    fixture.componentRef.setInput('tenant', mockTenant);
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('plastik-img-container');
    expect(img).toBeTruthy();
  });

  it('should display icon when tenant has no logo', () => {
    fixture.componentRef.setInput('tenant', mockTenantNoLogo);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('mat-icon');
    expect(icon).toBeTruthy();
  });

  it('should display tenant name', () => {
    fixture.componentRef.setInput('tenant', mockTenant);
    fixture.detectChanges();
    const nameSpan = fixture.nativeElement.querySelector('span');
    expect(nameSpan.textContent).toContain(mockTenant.name);
  });
});
