import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { EcoStoreProfileSidenavFeatureComponent } from './eco-store-profile-sidenav-feature.component';

describe('EcoStoreProfileSidenavFeatureComponent', () => {
  let component: EcoStoreProfileSidenavFeatureComponent;
  let fixture: ComponentFixture<EcoStoreProfileSidenavFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreProfileSidenavFeatureComponent],
      providers: [provideTranslateService(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreProfileSidenavFeatureComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  }, 30000);
});
