import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { SafeFormattedPipe } from '@plastik/shared/formatters';
import { SharedTableUiComponent } from '@plastik/shared/table/ui';

import { LlecoopUserOrderResumeFacadeService } from '../user-order-resume-facade.service';
import { LlecoopUserOrderFeatureResumeComponent } from './user-order-feature-resume.component';

describe('LlecoopUserOrderFeatureResumeComponent', () => {
  let component: LlecoopUserOrderFeatureResumeComponent;
  let fixture: ComponentFixture<LlecoopUserOrderFeatureResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LlecoopUserOrderFeatureResumeComponent, SharedTableUiComponent, SafeFormattedPipe],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideMockStore(),
        {
          provide: LlecoopUserOrderResumeFacadeService,
          useValue: {
            tableDefinition: {
              columnProperties: signal([]),
              count: signal(0),
            },
            viewConfig: signal({
              title: '',
              icon: '',
            }),
            userOrder: signal(null),
            orderStatus: signal({
              class: '',
              icon: '',
              label: '',
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LlecoopUserOrderFeatureResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
