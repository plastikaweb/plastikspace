import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideEnvironmentMock } from '@plastik/core/environments';

import { NasaImagesFeatureSearchComponent } from './nasa-images-feature-search.component';

describe('NasaImagesFeatureSearchComponent', () => {
  let component: NasaImagesFeatureSearchComponent;
  let fixture: ComponentFixture<NasaImagesFeatureSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NasaImagesFeatureSearchComponent, HttpClientTestingModule, StoreModule.forRoot({}), EffectsModule.forRoot([])],
      providers: [provideEnvironmentMock()],
    }).compileComponents();

    fixture = TestBed.createComponent(NasaImagesFeatureSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
