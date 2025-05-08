import { provideExperimentalZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DETAIL_ITEM_VIEW_FACADE } from '@plastik/core/detail-edit-view';

import { ProfileFeatureComponent } from './profile-feature.component';

describe('ProfileFeatureComponent', () => {
  let component: ProfileFeatureComponent;
  let fixture: ComponentFixture<ProfileFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileFeatureComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        {
          provide: DETAIL_ITEM_VIEW_FACADE,
          useValue: {
            formConfig: {
              getConfig: () => [],
            },
            viewConfig: signal({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
