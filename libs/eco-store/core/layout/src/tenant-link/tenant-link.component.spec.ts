import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { EcoTenantLinkComponent } from './tenant-link.component';

const mockTenant = mockEcoStoreTenantStore.tenant();

describe('EcoTenantLinkComponent', () => {
  let component: EcoTenantLinkComponent;
  let fixture: ComponentFixture<EcoTenantLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoTenantLinkComponent],
      providers: [provideRouter([]), provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoTenantLinkComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a button with routerLink to "/"', () => {
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('routerLink')).toBe('/');
  });

  it('should emit linkClicked when button is clicked', () => {
    const emitSpy = jest.spyOn(component.linkClicked, 'emit');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should contain eco-tenant-logo', () => {
    fixture.componentRef.setInput('tenant', mockTenant);
    fixture.detectChanges();
    const logo = fixture.nativeElement.querySelector('eco-tenant-logo');
    expect(logo).toBeTruthy();
  });
});
