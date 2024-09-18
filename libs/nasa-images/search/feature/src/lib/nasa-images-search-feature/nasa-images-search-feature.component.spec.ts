import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { provideEnvironmentMock } from '@plastik/core/environments';
import { NasaImagesSearchFacade } from '@plastik/nasa-images/search/data-access';
import { NasaImagesSearchApiParams } from '@plastik/nasa-images/search/entities';
import { PageEventConfig } from '@plastik/shared/table/entities';

import { axe, toHaveNoViolations } from 'jest-axe';
import { NasaImagesSearchFeatureComponent } from './nasa-images-search-feature.component';

describe('NasaImagesSearchFeatureComponent', () => {
  let component: NasaImagesSearchFeatureComponent;
  let fixture: ComponentFixture<NasaImagesSearchFeatureComponent>;
  let facade: NasaImagesSearchFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, NasaImagesSearchFeatureComponent],
      providers: [provideEnvironmentMock(), provideHttpClientTesting(), provideMockStore()],
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

    it('should not call search facade method with empty q param', () => {
      const params: NasaImagesSearchApiParams = { q: '' };
      component.onChange(params);
      expect(facade.search).toHaveBeenCalled();
    });

    it('should not call search facade method with no q param', () => {
      const params: Partial<NasaImagesSearchApiParams> = { page: 1 };
      component.onChange(params);
      expect(facade.search).not.toHaveBeenCalled();
    });
  });

  it('onChangePagination should call search changePagination method', () => {
    const tablePagination: PageEventConfig = { pageIndex: 1, pageSize: 100 };
    component.onChangePagination(tablePagination);
    expect(facade.changePagination).toHaveBeenCalledWith(tablePagination);
  });

  it('should have no accessibility violations', async () => {
    expect.extend(toHaveNoViolations);
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
