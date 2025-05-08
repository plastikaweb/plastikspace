import { DIALOG_DATA } from '@angular/cdk/dialog';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedConfirmFeatureComponent } from './shared-confirm-feature.component';

describe('SharedConfirmFeatureComponent', () => {
  let component: SharedConfirmFeatureComponent;
  let fixture: ComponentFixture<SharedConfirmFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedConfirmFeatureComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedConfirmFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
