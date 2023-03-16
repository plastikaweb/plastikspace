import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { provideEnvironmentMock } from '@plastik/core/environments';
import { NasaImagesFacade } from '@plastik/nasa-images/data-access';
import { NasaImagesSearchApiParams } from '@plastik/nasa-images/entities';
import { PageEventConfig } from '@plastik/shared/table/entities';

import { NasaImagesFeatureSearchComponent } from './nasa-images-feature-search.component';

describe('NasaImagesFeatureSearchComponent', () => {
  let component: NasaImagesFeatureSearchComponent;
  let fixture: ComponentFixture<NasaImagesFeatureSearchComponent>;
  let facade: NasaImagesFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        NasaImagesFeatureSearchComponent,
        HttpClientTestingModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
      ],
      providers: [provideEnvironmentMock(), provideMockStore()],
    })
      .overrideProvider(NasaImagesFacade, {
        useValue: { search: jest.fn(), changePagination: jest.fn() },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NasaImagesFeatureSearchComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(NasaImagesFacade);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onChange', () => {
    it('should call search facade method', () => {
      const params: NasaImagesSearchApiParams = { q: 'pluto' };
      component.onChange(params);
      expect(facade.search).toHaveBeenCalledWith(params);
    });

    it('should not call search facade method', () => {
      const params: NasaImagesSearchApiParams = { q: 'a' };
      component.onChange(params);
      expect(facade.search).not.toHaveBeenCalled();
    });

    it('should call search facade method with empty params', () => {
      const params: NasaImagesSearchApiParams = { q: '' };
      component.onChange(params);
      expect(facade.search).toHaveBeenCalledWith(params);
    });
  });

  it('onChangePagination should call search changePagination method', () => {
    const tablePagination: PageEventConfig = { pageIndex: 1, pageSize: 100 };
    component.onChangePagination(tablePagination);
    expect(facade.changePagination).toHaveBeenCalledWith(tablePagination);
  });
});
