import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { mockPocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { EcoStoreProfileFeatureComponent } from './eco-store-profile-feature.component';

describe('EcoStoreProfileFeatureComponent', () => {
  let component: EcoStoreProfileFeatureComponent;
  let fixture: ComponentFixture<EcoStoreProfileFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreProfileFeatureComponent],
      providers: [
        provideTranslateService(),
        provideRouter([]),
        {
          provide: pocketBaseUserProfileStore,
          useValue: mockPocketBaseUserProfileStore,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreProfileFeatureComponent);
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
