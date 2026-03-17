import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormlyModule } from '@ngx-formly/core';
import { provideTranslateService } from '@ngx-translate/core';
import { DETAIL_ITEM_VIEW_FACADE } from '@plastik/core/detail-edit-view';
import { ProfileFeatureComponent } from './profile-feature.component';

describe('ProfileFeatureComponent', () => {
  let component: ProfileFeatureComponent;
  let fixture: ComponentFixture<ProfileFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileFeatureComponent, FormlyModule.forRoot()],

      providers: [
        provideZonelessChangeDetection(),
        provideTranslateService(),
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
