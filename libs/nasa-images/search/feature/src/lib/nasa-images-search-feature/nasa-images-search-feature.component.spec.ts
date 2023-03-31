import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { provideEnvironmentMock } from '@plastik/core/environments';
import { NasaImagesSearchFacade } from '@plastik/nasa-images/search/data-access';
import { NasaImagesSearchApiParams } from '@plastik/nasa-images/search/entities';
import { PageEventConfig } from '@plastik/shared/table/entities';

import { NasaImagesSearchFeatureComponent } from './nasa-images-search-feature.component';

describe('NasaImagesSearchFeatureComponent', () => {
  let component: NasaImagesSearchFeatureComponent;
  let fixture: ComponentFixture<NasaImagesSearchFeatureComponent>;
  let facade: NasaImagesSearchFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        NasaImagesSearchFeatureComponent,
        HttpClientTestingModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
      ],
      providers: [provideEnvironmentMock(), provideMockStore()],
    })
      .overrideProvider(NasaImagesSearchFacade, {
        useValue: { search: jest.fn(), changePagination: jest.fn() },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NasaImagesSearchFeatureComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(NasaImagesSearchFacade);
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
