import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { axe, toHaveNoViolations } from 'jest-axe';
import { EcoFooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: EcoFooterComponent;
  let fixture: ComponentFixture<EcoFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoFooterComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoFooterComponent);
    fixture.componentRef.setInput('tenant', mockEcoStoreTenantStore.tenant());
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    expect.extend(toHaveNoViolations);
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
