import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { TenantLogoComponent } from './tenant-logo.component';

const mockTenant = mockEcoStoreTenantStore.tenant();
const mockTenantNoLogo = { ...mockTenant, logo: undefined };

describe('TenantLogoComponent', () => {
  let component: TenantLogoComponent;
  let fixture: ComponentFixture<TenantLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantLogoComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(TenantLogoComponent);
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

  it('should use responsive class by default', () => {
    fixture.componentRef.setInput('tenant', mockTenant);
    fixture.detectChanges();
    const nameSpan = fixture.nativeElement.querySelector('span');
    expect(nameSpan.classList).toContain('hidden');
    expect(nameSpan.classList).toContain('md:block');
  });

  it('should show name always if showName is set to always', () => {
    fixture.componentRef.setInput('tenant', mockTenant);
    fixture.componentRef.setInput('showName', 'always');
    fixture.detectChanges();
    const nameSpan = fixture.nativeElement.querySelector('span');
    expect(nameSpan.classList).not.toContain('hidden');
  });
});
