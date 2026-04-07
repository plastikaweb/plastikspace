import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { mockPocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access/testing';
import { providePlainInputFormly } from '@plastik/shared/form/util';
import { beforeEach, describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { EcoStoreProfileBasicFeatureComponent } from './eco-store-profile-basic-feature.component';

describe('EcoStoreProfileBasicFeatureComponent', () => {
  let component: EcoStoreProfileBasicFeatureComponent;
  let fixture: ComponentFixture<EcoStoreProfileBasicFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreProfileBasicFeatureComponent],
      providers: [
        provideTranslateService(),
        providePlainInputFormly(),
        {
          provide: pocketBaseUserProfileStore,
          useValue: mockPocketBaseUserProfileStore,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreProfileBasicFeatureComponent);
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
